
import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import TextareaAutosize from 'react-textarea-autosize';
import { AiOutlineMenu, AiOutlinePlus, AiOutlineDown, AiOutlineCopy } from "react-icons/ai";
import { PropertyHeader } from "./PropertyRenderer"
import { FrameError } from "./utils"
import { DataRenderer } from "./DatatypeRenderer"
import { ChoiceRenderer } from "./ChoiceRenderer"
import { DocumentRenderer } from "./LinkRenderer"
import { ObjectRenderer } from "./ObjectRenderer"
import OutsideClickHandler from 'react-outside-click-handler';
import {RiDeleteBin5Line} from "react-icons/ri"
import Select from "react-select"

export const ValueRenderer = ({expansion, redraw, deleteValue, updateValue, PropertyChooser, ViewChooser, index, frame, mode, view, types, docs}) => {
    let [v, setV] = useState(false)
    useEffect(() => setV(frame.get()), [redraw, frame])

    const updval = (vv) => {
        setV(vv)
        frame.set(vv)            
    }
    if(v === false) return null
    let ret = null
    if(!frame.isData()){
        ret = <ObjectRenderer 
            redraw={redraw} 
            expansion={expansion} 
            frame={frame} 
            index={index} 
            view={view} 
            mode={mode} 
            types={types} 
            docs={docs}
        /> 			
    }
    else if(frame.isChoice()){  
        ret = <ChoiceRenderer 
            redraw={redraw}  
            expansion={expansion} 
            index={index} 
            val={v} 
            frame={frame} 
            mode={mode} 
            view={view} 
            types={types} 
            docs={docs} 
        />
    }
    else if(frame.isDocument()){
        ret = <DocumentRenderer 
            redraw={redraw} 
            expansion={expansion} 
            index={index} 
            val={v} 
            frame={frame} 
            mode={mode} 
            view={view}  
            types={types} 
            docs={docs}
        />
    }
    else if(frame.isData()){
        ret = <DataRenderer 
            redraw={redraw} 
            expansion={expansion} 
            index={index} 
            frame={frame} 
            val={v} 
            type={frame.getType()} 
            mode={mode} 
            updateVal={updval} view={view}  types={types} docs={docs}/>
    }
    else {
        alert("Frame has no known type")
        console.log(frame)
    }
    if(expansion && expansion == "block-list" && index > 0){
        return <span className="property-block">
            <PropertyHeader index={index} expansion={expansion} frame={frame} mode={mode} view={view} types={types} docs={docs} />
            {ret}
        </span>
    }
    return ret
}

export const ValueRow = ({mode, addValue, deleteValue, duplicateValue, PropertyChooser, ViewChooser, type, frame, tindex, readversion, editversion}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active)  
    const activeOn = () => setActive(true) 
    const activeOff = () => setActive(false) 

    let cname = (type && type == "choice") ? "wiki-choice-row" : "wiki-value-row"
    let err = {
        'vio:message': {"@value": "this is a error"} 
    }
    return <Row className={"wiki-row " + cname} onMouseEnter={activeOn} onMouseLeave={activeOff}>
        <Col className={"wiki-action-column " + cname + "-actions"} md={1}>
        {active && 
            <ValueActions 
                addValue={addValue} 
                deleteValue={deleteValue} 
                duplicateValue={duplicateValue} 
                PropertyChooser={PropertyChooser} 
                ViewChooser={ViewChooser} 
                mode={mode}
                frame={frame} 
            />
        }
        </Col>
        <Col className="wiki-main-column" md={10}>
            <Row>
                {tindex &&
                    <Col className="wiki-index-col"> 
                        <span className='wiki-index wiki-data-index'>{tindex}</span>
                    </Col>
                }
                <Col className="wiki-content-col"> 
                    {mode == "edit" && 
                        <>{editversion}</>
                    }
                    {mode != "edit" && 
                        <>{readversion}</>
                    }
                    {err && 
                        <span className="wiki-row-error">
                            <FrameError error={err} />
                        </span>
                    }
                </Col>
            </Row>
        </Col>
        <Col className="wiki-navigation-column" md={1}>
            {active && 
                <span className="wiki-right-contents"> 
                    <ValueNavigation frame={frame} deleteValue={deleteValue} />
                </span>
            }
        </Col>
    </Row>
}


export const ValueActions = ({frame, addValue, deleteValue, duplicateValue, PropertyChooser, ViewChooser, mode, view}) => {
    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => setShowMenu(!showMenu)
    let editable = (mode && mode == "edit") 
    return <span className="wiki-left-contents"> 
        <span className="wiki-left-icon" onClick={toggleMenu}><AiOutlineMenu /></span>
        {addValue && editable && false && 
            <span className="wiki-left-icon" onClick={addValue}><AiOutlinePlus /></span>
        }
        {showMenu && frame &&
            <ValueMenu 
                isOpen={true} 
                mode={mode} 
                addValue={addValue} 
                deleteValue={deleteValue}
                duplicateValue={duplicateValue} 
                PropertyChooser={PropertyChooser} 
                ViewChooser={ViewChooser}  
                frame={frame} 
                toggle={toggleMenu}
            /> 
        }
    </span>
}


export const ValueNavigation = ({frame, deleteValue}) => {
    return <span className="wiki-right-contents"> 
        <span className="wiki-right-icon" onClick={deleteValue}><RiDeleteBin5Line /></span>
    </span>
}

export const ValueMenu = ({addValue, deleteValue, frame, toggle, duplicateValue, PropertyChooser, ViewChooser }) => {
    if(!(addValue || deleteValue || duplicateValue || PropertyChooser || ViewChooser)){
        return null
    }

    const doDelete = () => {
        toggle(false)
        deleteValue()
    }

    const doAdd = () => {
        toggle(false)
        addValue()
    }

    const doDup = (e) => {
        toggle(false)
        duplicateValue()
    }

    const onOutsideClick = ()=>{
        if(isOpen===true){
            toggle(false)
        }
    }

    return(<OutsideClickHandler onOutsideClick={onOutsideClick} >  
                <div className="wiki-menu">
                    {deleteValue &&                    
                        <div className="wiki-menu-entry wiki-menu-delete" onClick={doDelete}>
                            <RiDeleteBin5Line className='wiki-menu-icon'/> Delete 
                        </div>                  
                    }
                    {duplicateValue &&                    
                        <div className="wiki-menu-entry wiki-menu-delete" onClick={doDup}>
                            <AiOutlineCopy className='wiki-menu-icon'/> Duplicate 
                        </div>    
                    }              
                    {(duplicateValue || deleteValue) && 
                        <div className="wiki-menu-spacer"></div>
                    }
                    {addValue && 
                        <>                    
                            <div className="wiki-menu-entry wiki-menu-add" onClick={doAdd}>
                                <AiOutlinePlus className='wiki-menu-icon'/> Add new {frame.getLabel()} value
                            </div>                  
                            <div className="wiki-menu-spacer"></div>
                        </>
                    }
                    {ViewChooser && 
                        <>
                            <div className="wiki-menu-selector wiki-menu-addparent">
                                {ViewChooser}
                            </div>
                            <div className="wiki-menu-spacer"></div>
                        </>
                    }
                    {PropertyChooser && 
                        <div className="wiki-menu-selector wiki-menu-addparent">
                                {PropertyChooser}
                        </div>
                    }
                </div>
            </OutsideClickHandler>
            
    )

}