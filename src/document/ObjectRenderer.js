import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import TextareaAutosize from 'react-textarea-autosize';
import { AiOutlineCaretDown, AiOutlineMenu  } from "react-icons/ai";
import { PropertyRenderer } from "./PropertyRenderer"
import { getTypeStruct } from "./utils"

export const ObjectRenderer = ({frame, mode, view, docs, types}) => {
    if(!frame) return null
    const initiallyExpanded = (frame) => {
        if(frame.depth() == 0){
            return true
        }
        return !frame.display_options.collapse
    }
    const [redraw, setRedraw] = useState(1)
    const [active, setActive] = useState(false)
    const [expanded, setExpanded] = useState(initiallyExpanded(frame))
    const toggleExpanded = () => setExpanded(!expanded)


    const renderProperties = () => {
        let props = frame.sortProperties();
        let nprops = []
	    for (let i = 0; i < props.length; i++) {
            let vframe = frame.properties[props[i]]
            if(!vframe.display_options.hidden){
                let nprop = <PropertyRenderer redraw={redraw} types={types} docs={docs} view={view} key={props[i] + "_property"} frame={vframe} mode={mode}/>
                if(nprop) nprops = nprops.concat(nprop)
            }
        }
        return nprops
    }

    if(!expanded){
        return <ObjectSummary view={view} frame={frame} mode={mode} types={types} docs={docs} toggleExpanded={toggleExpanded} />
    }
    else {
        let props = renderProperties()
        return <div className={active ? "wiki-object-selected":"wiki-object-wrapper"}>
            <ObjectHeader view={view} frame={frame} mode={mode} types={types} docs={docs} toggleExpanded={toggleExpanded} isActive={setActive}/>
            {props}
        </div>
    }
}

export const ObjectActions = ({frame, onCollapse}) => {
    return <span className="wiki-left-contents"> 
        <span className="wiki-left-icon" onClick={onCollapse}><AiOutlineCaretDown /></span>
    </span>
}

export const ObjectSummary = ({frame, mode, view, types, docs, toggleExpanded}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => { setActive(!active); if(isActive) isActive(!active) } 
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

    return <Row className="wiki-type-row" onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
        <Col className="wiki-left wiki-type-left" md={1}>
            {active && 
                <PageActions frame={frame} />
            }
        </Col>
        <Col className="wiki-centre wiki-type-centre" md={10}>
            {otype} ~ {oid}
        </Col>
        <Col className="wiki-right wiki-title-right" md={1}>
            {active && 
                <ObjectActions frame={frame} onCollapse={toggleExpanded} />
            }
        </Col>
    </Row>    
    return <Row><Col>yo</Col></Row> 
}

export const ObjectHeader = ({frame, mode, view, types, docs, isActive, toggleExpanded}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => { setActive(!active); if(isActive) isActive(!active) } 
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

    return <Row className="wiki-type-row" onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
        <Col className="wiki-left wiki-type-left" md={1}>
            {active && 
                <PageActions frame={frame} />
            }
        </Col>
        <Col className="wiki-centre wiki-type-centre" md={10}>
            <TextareaAutosize minRows={1} className="wiki wiki-type">{tstruct.label}</TextareaAutosize>
        </Col>
        <Col className="wiki-right wiki-title-right" md={1}>
            {active && 
                <ObjectActions frame={frame} onCollapse={toggleExpanded} />
            }
        </Col>
    </Row>    
}

export const PageActions = ({frame, mode, view}) => {
    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => setShowMenu(!showMenu)

    const onAddProp = (e) => {
        frame.addProperty(e.value)
        setRedraw(redraw + 1)
    }

    const getMissingPropertySelector = () => {
        let mpl = frame.getMissingPropertyList()
        if(Object.keys(mpl).length){
            return <Select  
                onChange={onAddProp} 
                options={mpl}  
                placeholder="Add Property"
            />
        }
        return null
    }
    return <span className="wiki-left-contents"> 
        <span className="wiki-left-icon" onClick={toggleMenu}><AiOutlineMenu /></span>
        {showMenu && frame &&
            <>{getMissingPropertySelector()}</>
        }
    </span>
}
