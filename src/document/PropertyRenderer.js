import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import TextareaAutosize from 'react-textarea-autosize';
import { AiOutlineMenu, AiOutlinePlus, AiOutlineDown } from "react-icons/ai";
import { ValueRenderer, PageActions } from "./ValueRenderer"
import { getTypeStruct } from "./utils"
import {Dropdown} from "../form/Dropdown"
import OutsideClickHandler from 'react-outside-click-handler';
import {RiDeleteBin5Line} from "react-icons/ri"
import Select from "react-select"

export const PropertyRenderer = ({frame, mode, view, types, docs}) => {
    if(!frame) return null
    if(!frame.getLabel){
        console.log("strange frame", frame)
        return null
    }
    if(frame.depth() == 0){
        if(frame.predicate == "rdfs:label" && frame.values.length == 1) return null
        if(frame.predicate == "rdfs:comment" && frame.values.length == 1) return null
    }
    const [redraw, setRedraw] = useState(1)
    const [rvals, setRvals] = useState()
    const [expansion, setExpansion] = useState(getInitialFrameExpansion(frame, view, types, docs))
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    const activeOn = () => setActive(true) 
    const activeOff = () => setActive(false) 
    useEffect(() => setRvals(getPvals()), [frame, mode])

    const toggleExpanded = () => {
        if(expansion == 'compressed'){
            setExpansion(getInitialFrameExpansion(frame, view, types, docs))
        }
        else {
            setExpansion('compressed')
        }
    }
    

    function addValue(){
        frame.addValueFrame(frame.createEmpty())
        setRvals(getPvals())
        setRedraw(redraw+1)
    }

    const deleteValue = (val, index) => {
        frame.removeValue(val)
        setRvals(getPvals())
        setRedraw(redraw+1)
    }

    function getPvals(){
        let vals = []
        const isDup = (val) => {
            if(vals.indexOf(val) == -1){
                vals.push(val)
                return false
            }
            return true
        }
        let rvals = []
        for(var i = 0 ; i < frame.values.length; i++){
            if(!isDup(frame.values[i].get())){
                rvals.push(frame.values[i])
            }
        }
        return rvals
    }


    function getDelVal(index, vframe){
        let g = vframe.get()
        let f = function(){
            alert(index)
            deleteValue(g, index)
        }
        return f
    }

    if(!rvals || !rvals.length) return null
    if(expansion == "compressed"){
        return <div className='wiki-property-wrapper'>
            <CompressedProperty toggleExpanded={toggleExpanded} frame={frame} mode={mode} view={view} types={types} docs={docs} />
        </div>
    }
    
    let rows = []
    for(var i = 0 ; i < rvals.length; i++){
        if(!((frame.predicate == "rdfs:label" || frame.predicate == "rdfs:comment") && i == 0)){
            rows.push(
                <ValueRenderer redraw={redraw} deleteValue={getDelVal(i, rvals[i])} addValue={addValue} index={i} expansion={expansion} key={frame.predicate  + "_" + i}  types={types} docs={docs} redraw={redraw} frame={rvals[i]} mode={mode} view={view}/>
            )
        }
    }
    return <div className='wiki-property-wrapper' onMouseEnter={activeOn} onMouseLeave={activeOff}>
        <PropertyHeader addValue={addValue} toggleExpanded={toggleExpanded} active={active} expansion={expansion} frame={frame} mode={mode} view={view} types={types} docs={docs} />
        {rows}
    </div>
}



function getInitialFrameExpansion(frame, view, types, docs){
    if(!frame) return "list"
    let longs = ["xdd:json", "xdd:html", "xdd:coordinatePolyline", "xdd:coordinatePolygon"]
    let t = frame.range()
    if(typeof frame.display_options.collapse != "undefined"){
        if(frame.display_options.collapse) return "compressed"
        return "list"
    }

    if(frame.isObject()) return "list"
    if(frame.values.length > 1){
        if(typeof frame.display_options.args != "undefined"){
            if(frame.display_options.args['block']) return "block-list"
        }
        if(longs.indexOf(TerminusClient.UTILS.shorten(t)) != -1) return "block-list"
        return "list"
    }
    else {
        if(typeof frame.display_options.args != "undefined"){
            if(frame.display_options.args['block']) return "block"
        }
        if(longs.indexOf(TerminusClient.UTILS.shorten(t)) == -1) return "compressed"
        return "list"
    }
}


export const PropertyHeader = ({frame, expansion, index, active, addValue, deleteValue, mode, view, types, docs, toggleExpanded}) => {
    //const [active, setActive] = useState(false)
    //const toggleActive = () => setActive(!active)
    let tindex = (expansion == "block-list" ? (index ? (index+1) : 1) : false)
    return <Row className={"wiki-row " + "wiki-property-header-row"}>
        <Col className={"wiki-action-column property-actions"} md={1}>
            <PropertyActions frame={frame} addValue={addValue} active={active} />
        </Col>
        <Col className="wiki-main-column" md={10}>
            {getHeaderTag(frame, expansion=='compressed', tindex)}
        </Col>
        <Col className="wiki-navigation-column" md={1}>
            {active && 
                <PropertyNavigation onCollapse={toggleExpanded} frame={frame} />
            }
        </Col>
    </Row>
}


const getHeaderTag = (frame, compressed, index) => {
    let l = frame.depth() + 2
    let cname = (frame.isObject() || frame.isClassChoice() 
        ? "wiki-property-header wiki-propery-header-" + l 
        : "wiki-property-label wiki-propery-label-" + l) 
    let lab = frame.getLabel()
    let p = TerminusClient.UTILS.shorten(frame.predicate)
    if(frame.depth() == 0 && (p == "rdfs:label" || p == "rdfs:comment")){
        lab = "Alternative " + lab
    }
    if(index) lab += " (" + index + ")"
    if(compressed) return <span className={cname}>{lab}</span>
    return <div className={cname}>{lab}</div>
}

export const CompressedProperty = ({frame, mode, view, index, types, docs, toggleExpanded}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    if(frame.values.length == 1){
        return <Row className={"wiki-row " + "wiki-property-header-row"} onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
            <Col md={1}>{active && 
                <PageActions frame={frame} />
            }
            </Col>
            <Col md={10}>
                {getHeaderTag(frame, true)}
                <ValueRenderer index="0" expansion="compressed" types={types} docs={docs} frame={frame.values[0]} mode={mode} view={view}/>
            </Col>
            <Col md={1}>
                {active && 
                    <PageActions frame={frame} />
                }
            </Col>
        </Row>    
    }
    else {
        return <PropertySummary toggleExpanded={toggleExpanded} frame={frame} mode={mode} view={view} types={types} docs={docs} />
    }
}



export const PropertyActions = ({frame, addValue, active, mode, view}) => {
    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => setShowMenu(!showMenu)
    return <>
            {showMenu && frame &&
                <PropertyMenu isOpen={true} frame={frame} toggle={toggleMenu}/> 
            }
            {active && 
                <span className="wiki-left-contents"> 
                    <span className="wiki-left-icon" onClick={toggleMenu}><AiOutlineMenu /></span>
                    {addValue && 
                        <span className="wiki-left-icon" onClick={addValue}><AiOutlinePlus /></span>
                    }
                </span>
            }
    </>
}



export const PropertyMenu = ({className, title, frame, isOpen, toggle, mouseOverActive, onClickAction }) => {

    const doDelete = () => {
        alert("deleting property " + frame.predicate)
    }

    const getViewerSelector = () => {
        let mpl = frame.parent.getMissingPropertyList()
        if(Object.keys(mpl).length){
            return <Select  
                onChange={doDelete} 
                options={mpl}  
                placeholder={"Select " + frame.getLabel() + " viewer"}
            />
        }
        return null
    }
    
    const getMissingPropertySelector = () => {
        let mpl = frame.parent.getMissingPropertyList()
        if(Object.keys(mpl).length){
            return <Select  
                onChange={doDelete} 
                options={mpl}  
                placeholder="Add Property to Parent"
            />
        }
        return null
    }

    const onOutsideClick = ()=>{
        if(isOpen===true){
            toggle(false)
        }
    }
    const onMouseEnter=()=>{
        toggle(true);
    }

    const onMouseLeave =()=>{
        toggle(false)
    }

    const onClick=()=>{
        toggle(!isOpen)
        if(onClickAction)onClickAction()
    }

    const mouseOver = mouseOverActive===true ? {onMouseEnter:onMouseEnter, onMouseLeave:onMouseLeave} : {}
    const dropdownContent = isOpen===true ? "tdb__dropdown__content  tdb__dropdown__content--show" : "tdb__dropdown__content tdb__dropdown__content--hide"

    return(<OutsideClickHandler onOutsideClick={onOutsideClick} >  
                <div className="wiki-menu">                   
                    <div className="wiki-menu-entry wiki-menu-add" onClick={doDelete}>
                        <AiOutlinePlus className='wiki-menu-icon'/> Add {frame.getLabel()} value
                    </div>                  
                    <div className="wiki-menu-entry wiki-menu-delete" onClick={doDelete}>
                        <RiDeleteBin5Line className='wiki-menu-icon'/> Delete all {frame.getLabel()} values
                    </div>                  
                    <div className="wiki-menu-spacer"></div>
                    <div className="wiki-menu-selector wiki-menu-addparent" onClick={doDelete}>
                        {getViewerSelector()}
                    </div>
                    <div className="wiki-menu-spacer"></div>
                    <div className="wiki-menu-selector wiki-menu-addparent" onClick={doDelete}>
                        {getMissingPropertySelector()}
                    </div>
                </div>
            </OutsideClickHandler>
            
    )

}

export const PropertyNavigation = ({frame, onCollapse}) => {
    return <span className="wiki-right-contents"> 
        <span className="wiki-right-icon" onClick={onCollapse}><AiOutlineDown /></span>
    </span>
}

export const PropertySummary = ({frame, mode, view, types, docs, toggleExpanded}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    const [oid, setOid] = useState(frame.subject())
    const [otype, setOtype] = useState(frame.subjectClass())
    let showid = false
    let showtype = false

    const updateID = (nid) => {
        frame.subjid = nid
        setOid(nid)
    } 

    const updateType = (ntype) => {
        frame.cls = ntype
        setOtype(ntype)
    } 

    let tstruct = otype ? getTypeStruct(otype, types) : {} 
    return <Row className={"wiki-row " + "wiki-property-header-row"} onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
        <Col className={"wiki-action-column property-actions"} md={1}>
        {active && 
            <PropertyActions frame={frame} />
        }
        </Col>
        <Col className="wiki-main-column" md={10}>
            {getHeaderTag(frame, true)} property summary details
        </Col>
        <Col className="wiki-navigation-column" md={1}>
            {active && 
                <PropertyNavigation onCollapse={function() {toggleExpanded(); toggleActive()}} frame={frame} />
            }
        </Col>
    </Row>
}
