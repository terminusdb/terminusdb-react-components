import TerminusClient from '@terminusdb/terminusdb-client'
import React, {useState, useEffect} from 'react'
import {Row, Col} from 'reactstrap'
import Select from "react-select"
import { AiOutlineMenu, AiOutlinePlus, AiOutlineDown, AiOutlineRight, AiOutlineSave  } from "react-icons/ai";

export function getTypeStruct(type, types){
    let rec = (types ? types[type] || types[TerminusClient.UTILS.unshorten[type]] : false)
    let meta = {}
    meta.id = TerminusClient.UTILS.shorten(type)
    if(rec){
        meta.label = rec && rec['Class Name'] ? rec['Class Name']["@value"] : meta.id 
        meta.comment = rec && rec['Description'] ? rec['Description']["@value"] : ""
    }
    else {
        meta.label = TerminusClient.UTILS.labelFromURL(type)
        meta.comment = ""
    }
    return meta 
}

export function getDocStruct(docid, docs){
    let rec = (docs? docs[docid] || docs[TerminusClient.UTILS.unshorten[docid]] : false)
    if(!rec) return false
    let meta = {}
    meta.id = TerminusClient.UTILS.shorten[docid]
    if(rec && rec['Name'] && rec['Name']["@value"]){
        meta.label = rec['Name']["@value"]
    } 
    if(rec && rec['Description'] && rec['Description']["@value"]){
        meta.comment = rec['Description']["@value"]
    }
    return meta
}


export function addFrameControl(frame, cname, func) {
    if(!frame.controls) frame.controls = {}
    frame.controls[cname] = func
}

export const FrameError = ({error}) => {
    let msg = error && error['vio:message'] ? error['vio:message']["@value"] : error && error['api:message'] ? error['api:message'] : "Error with field" 
    return <span className='wiki-error-contents'>{msg}</span> 
}


export const StatusIndicator = ({type, status}) => {
    //if(!status) return null
    let sname = status || "ok"
    if(sname == "ok") return null
    let cname = "wiki-status-" + sname
    return <AiOutlineSave title={sname} className={'wiki-status-icon ' + cname} />  
}


export const FrameErrors = ({frame, view}) => {
    if(!frame.errors){
        return null
    }
    let fes = []
    for(var i = 0; i<frame.errors.length; i++){
        fes.push(<FrameError error={frame.errors[i]} />)
    }
    return <span>{fes}</span> 
}


export const WikiRow = ({menus, navigation, active, type, tindex, children}) => {
    let cname = (type) ? "wiki-" + type + "-row" : "wiki-value-row"
    return <Row className={"wiki-row " + cname}>
        <Col className={"wiki-action-column " + cname + "-actions"} md={1}>
            {menus}
        </Col>
        <Col className="wiki-main-column" md={10}>
            <Row className="wiki-main-column-inner">
                {tindex &&
                    <Col className="wiki-index-col"> 
                        <span className='wiki-index wiki-data-index'>{tindex}</span>
                    </Col>
                }
                <Col className="wiki-content-col"> 
                    {children}
                </Col>
            </Row>
        </Col>
        <Col className="wiki-navigation-column" md={1}>
            {active && 
                <span className="wiki-right-contents"> 
                    {navigation}
                </span>
            }
        </Col>
    </Row>
}

export function getMissingPropertySelector(frame, onSelect, text){
    text = text || "Add Property"
    const onAddProp = (e) => {
        onSelect(e.value)
    }
    let mpl = frame.getMissingPropertyList()
    if(Object.keys(mpl).length){
        return <span className="wiki-property-selector">
            <Select  
                onChange={onAddProp} 
                options={mpl}  
                placeholder={text}
            />
        </span>
    }
    return null
}

export function getFilledPropertySelector(frame, onSelect, text){
    text = text || "Go to Property"
    const onAddProp = (e) => {
        onSelect(e.value)
    }
    let mpl = frame.getMissingPropertyList()
    if(Object.keys(mpl).length){
        return <span className="wiki-property-selector">
            <Select  
                onChange={onAddProp} 
                options={mpl}  
                placeholder={text}
            />
        </span>
    }
    return null
}

export function hasControl(frame, cname){
    return (frame.controls && frame.controls[cname])
}

export function getDocLabel(frame, types, docs){
    let tstruct = getTypeStruct(frame.cls, types)
    let lab = tstruct.label
    let docstruct = getDocStruct(frame.subjid, docs)
    if(docstruct && docstruct.label){
        lab = docstruct.label
    }
    else {
        let dlab = frame.first("rdfs:label")
        if(dlab){
            lab = dlab
        }
    }
    return lab
}

export function getDocIDLabel(val, docs){
    let lab = val
    let docstruct = getDocStruct(val, docs)
    if(docstruct && docstruct.label){
        lab = docstruct.label
    }
    return lab
}
