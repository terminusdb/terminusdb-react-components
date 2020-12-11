import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import Select from 'react-select'; 
import TextareaAutosize from 'react-textarea-autosize';

let styles = {
    fancyPage: {},
    fancyPageHeader: {
        padding: "1em !important",
        height: "auto !important",
        border: "0 !important",
        fontSize: "3em",
    }
}

let headerstyle = {
    borderRadius: "6px 0 0 0",
    padding: "6px",
    backgroundColor: "#efefef",
    color: "#888"
}

let labelstyle = {}
let valuestyle = {}


export const FancyRenderer = ({frame, mode, view, errors}) => {   
    if(!frame) return false
    return (
        <span style={styles.fancyPage}>
            <FancyPageHeader frame={frame.document} mode={mode} view={view} />
            <ObjectRenderer frame={frame.document} mode={mode} view={view}/>
        </span>
    )
}

export const FancyPageHeader = ({frame, mode, view}) => {
    let type = TerminusClient.UTILS.shorten(frame.subjectClass())
    let lab = frame.first("rdfs:label")
    let desc = frame.first("rdfs:comment")
    let id = TerminusClient.UTILS.shorten(frame.subject())
    //if(mode == "edit"){
        return <span>
            <TextareaAutosize className="wiki wiki-title" placeholder={"Enter " + type + "  name"} value={lab} />
            <textarea className="wiki wiki-title" placeholder={"Enter " + type + "  name"} style={styles.fancyPageHeader}>{lab}</textarea>
            <textarea className="wiki wiki-description" placeholder={"Enter " + type + " description"}>{desc}</textarea>
        </span>
    //}
    //else {
    //    return <span style={{}}>
    //        <h1>{lab}</h1>
    //        <h2>ID: {id}</h2>
    //        <h3>Type: {type}</h3>
    //        <h4>{desc}</h4>
    //    </span>
//    }
}

export const ObjectRenderer = ({frame, mode, view}) => {
    if(!frame) return null
    const [redraw, setRedraw] = useState(1)
    const [oid, setOid] = useState(frame.subject())
    const [otype, setOtype] = useState(frame.subjectClass())


    let showid = false
    let showtype = false

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

    const updateID = (nid) => {
        frame.subjid = nid
        setOid(nid)
    } 

    const updateType = (ntype) => {
        frame.cls = ntype
        setOtype(ntype)
    } 

    const renderProperties = () => {
        let props = []
        for(var p in frame.properties){
            let vframe = frame.properties[p]
            if(Array.isArray(vframe)) vframe=vframe[0]
            props = props.concat(<PropertyRenderer view={view} key={p + "_property"} frame={vframe} mode={mode}/>)
        }
        return props
    }

    return <>
            <thead>
                <tr>
                    {mode!="edit" &&
                        <th colSpan="2" style={headerstyle} title={frame.subject()}>
                            {frame.subjectClass()}
                        </th>
                    }
                    {mode=="edit" &&
                        <th colSpan="3" style={headerstyle}>
                            <Row>
                                <Col title={frame.subject()}>{frame.subjectClass()}</Col>
                                <Col>
                                    {getMissingPropertySelector()}
                                </Col>
                            </Row>
                        </th>
                    }                                   </tr>
            </thead>
            <tbody>
                {showid && 
                    <IDRenderer id={oid} mode={mode} view={view} update={updateID}/>
                }
                {showtype && 
                    <TypeRenderer type={otype}  mode={mode} view={view} update={updateType}/>
                }
                {renderProperties()}
            </tbody>
        </>
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


export const PropertyRenderer = ({frame, mode, view}) => {
    if(!frame) return null
    const [redraw, setRedraw] = useState(1)
    const [rvals, setRvals] = useState()

    let delstyle = {
        padding: "4px"
    }

    useEffect(() => setRvals(getPvals()), [frame, mode])

    if(!frame.getLabel){
        console.log("strange frame", frame)
        return null
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

    function getLabelPart(len){
        return <td key={frame.predicate + "_label"} style={labelstyle} rowSpan={len}>
            {mode == "edit" &&
                <button onClick={addValue}>+</button>
            }
            {frame.getLabel()}
        </td>
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
            deleteValue(g, index)
        }
        return f
    }

    if(!rvals || !rvals.length) return null
    let rows = []
    for(var i = 0 ; i < rvals.length; i++){
        if(i == 0){
            rows.push(<tr key={frame.predicate  + "_" + i}>
                {getLabelPart(rvals.length)}
                {mode == "edit" &&
                    <td style={delstyle}><button onClick={getDelVal(i, rvals[i])}>-</button> </td>
                }
                <td key={frame.predicate  + "_value_" + i} style={valuestyle} >
                    <ValueRenderer redraw={redraw} frame={rvals[i]} mode={mode} view={view}/>
                </td>
            </tr>)
        }
        else {
            rows.push(<tr key={frame.predicate + "_" + i}>
                {mode == "edit" &&
                    <td style={delstyle}><button onClick={getDelVal(i, rvals[i])}>-</button></td>
                }
                <td style={valuestyle}>
                    <ValueRenderer redraw={redraw} frame={rvals[i]} mode={mode} view={view}/>
                </td>
            </tr>)
        }
    }
    return rows 
}

export const ValueRenderer = ({frame, mode, view, redraw}) => {
    let [v, setV] = useState("")

    useEffect(() => setV(frame.get()), [redraw, frame])

    const updval = (vv) => {
        setV(vv)
        frame.set(vv)            
    }
    if(!frame.isData()){
        return TableRenderer(frame, mode) 			
    }
    else if(frame.isChoice()){  
        return <ChoiceRenderer val={v} frame={frame} mode={mode} updateVal={updval} view={view} />
    }
    else if(frame.isDocument()){
        return <DocumentRenderer val={v} frame={frame} mode={mode} updateVal={updval} view={view} />
    }
    else if(frame.isData()){
        return <DataRenderer val={v} type={frame.getType()} mode={mode} updateVal={updval} view={view} />
    }
    else {
        alert("Frame has no known type")
        console.log(frame)
    }
}

export const DocumentRenderer = ({val, mode, frame, updateVal, view}) => {
    if(mode == "edit"){
        return <DataRenderer val={val} mode={mode} type={frame.getType()} updateVal={updateVal} />
    }
    else {
        let ds = function(){
            if(view.selectDocument) view.selectDocument(val)
        }
        let lstyle = {
            cursor: "pointer"
        }
        return <Row><Col>
            <span style={lstyle} onClick={ds}>{val}</span>
        </Col><Col></Col></Row>

    }
}


export const ChoiceRenderer = ({val, mode, frame, updateVal}) => {
    if(mode == "edit"){
        let lab = val || "Select from choices"
        let opts = frame.frame.elements.map((item) => {
            if(TerminusClient.UTILS.compareIDs(item.class, val)){
                lab = item.label["@value"]
            }
            return { value: TerminusClient.UTILS.shorten(item.class), label: item.label["@value"]}
        })
        
        let onChange = function(e){
            updateVal(e.value)
        }

        return <Row><Col><Select  
            defaultValue={val}
            isClearable={true}
            onChange={onChange} 
            options={opts}  
            placeholder={lab}
        /></Col><Col></Col></Row>

    }
    else {
        let tit = val
        let lab = val
        frame.frame.elements.map((item) => {
            if(TerminusClient.UTILS.compareIDs(item.class, val)){
                tit = val + " - " + item.comment["@value"]
                lab = item.label["@value"]
            }    
        })
        return <span title={tit}>{lab}</span>
    }
}

export const DataRenderer = ({val, mode, type, updateVal}) => {    
    if(mode == "edit"){
        let onc = function(e){
            updateVal(e.target.value)
        }
        let mv = (val ? "" + val : "")
        return <Row>
            <Col>
                <input type='text' value={mv} onChange={onc}/>
            </Col>
            <Col>
                {TerminusClient.UTILS.shorten(type)}
            </Col>
        </Row>
    }
    else {
        return val
    }
}

