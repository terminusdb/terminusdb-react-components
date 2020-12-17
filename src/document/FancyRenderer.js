import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import TextareaAutosize from 'react-textarea-autosize';
import { ObjectRenderer } from "./ObjectRenderer"
import { getTypeStruct } from "./utils"
import { ValueRow } from "./ValueRenderer"

export const FancyRenderer = ({frame, mode, view, errors, client}) => {  
    const [types, setTypes] = useState(false)
    const [docs, setDocs] = useState(false)
    let wq = TerminusClient.WOQL
    useEffect(() => {
        if(frame){
            let ntypes = {}
            let ndocs = {}
            let all_classes = frame.document.getPossibleContainedClasses()
            let all_docs = frame.document.getDocumentLinks()
            let q1 = wq.and(wq.lib().classes(), wq.member("v:Class ID", all_classes))
            let q2 = wq.and(wq.lib().document_metadata(), wq.member("v:Document ID", all_docs))
            client.query(q1).then((r) => {
                for(var i = 0; i<r.bindings.length; i++){
                    ntypes[r.bindings[i]["Class ID"]] = r.bindings[i]
                }
                setTypes(ntypes)
            })
            client.query(q2).then((r2) => {
                for(var i = 0; i<r2.bindings.length; i++){
                    ndocs[r2.bindings[i]["Document ID"]] = r2.bindings[i]
                }
                setDocs(ndocs)
            })
        }
    }, [client])

    if(!frame) return false
    return (
        <span className="wiki-page">
            <FancyPageHeader 
                frame={frame.document} 
                mode={mode} 
                view={view} 
                types={types}
            />
            <ObjectRenderer 
                frame={frame.document} 
                mode={mode} 
                view={view} 
                types={types} 
                docs={docs}
            />
        </span>
    )
}

export const FancyPageHeader = ({frame, mode, view, types}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 

    let tstruct = getTypeStruct(frame.subjectClass(), types)

    let type = tstruct.label
    let lab = frame.first("rdfs:label")
    let desc = frame.first("rdfs:comment")
    let id = TerminusClient.UTILS.shorten(frame.subject())

    let edittit =  <TextareaAutosize minRows={1} className="wiki wiki-title" placeholder={"Enter " + type + "  name"} >{lab}</TextareaAutosize>
    let readtit = <span className="wiki wiki-title">{lab}</span>

    let editdesc = <TextareaAutosize minRows={1} className="wiki wiki-description" placeholder={"Enter " + type + " description"} >{desc}</TextareaAutosize>
    let readdesc = <span className="wiki wiki-description">{desc}</span>


    return <span className="wiki-title-row" onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
        <ValueRow frame={frame} readversion={readtit} editversion={edittit} mode={mode} />
        <ValueRow frame={frame} readversion={readdesc} editversion={editdesc} mode={mode} />
    </span>
}




export const IDRenderer = ({id, mode, view, update}) => {
    let onc = function(e){
        update(e.target.value)
    }
    return <tr>
        <td style={labelstyle}>ID</td>
        {mode == "edit" &&
            <td></td>
        }
        <td style={valuestyle}>
            {mode != "edit" &&
                <span>{TerminusClient.UTILS.shorten(id)}</span>
            }
            {mode == "edit" &&
                <Row>
                    <Col>
                        <input type='text' value={TerminusClient.UTILS.shorten(id)} onChange={onc}/>
                    </Col>
                    <Col></Col>
                </Row>
            }
        </td>
    </tr>    
}

export const TypeRenderer = ({type, mode, view, update}) => {
    let onc = function(e){
        update(e.target.value)
    }
    return <tr>
        <td style={labelstyle}>Type</td>
        {mode == "edit" &&
            <td></td>
        }
        <td style={valuestyle}>
            {mode != "edit" &&
                <span>{TerminusClient.UTILS.shorten(type)}</span>
            }
            {mode == "edit" &&
                <Row>
                    <Col><input type='text' value={TerminusClient.UTILS.shorten(type)} onChange={onc}/></Col>
                    <Col></Col>
                </Row>
            }
        </td>
    </tr>    
}



