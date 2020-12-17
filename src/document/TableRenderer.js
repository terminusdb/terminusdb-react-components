import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import Select from 'react-select'; 

let valuestyle = {
    padding: "0.5em"    
}

let labelstyle = {
    backgroundColor: "#efefef",
    fontWeight: 600,
    borderRadius: "0 0 0 6px",
    textAlign: "right",
    padding: "6px",
    borderBottom: "1px solid white",
    width: "150px"
}

let tabstyle = {
    width: "100%",
}

export const TableRenderer = ({frame, mode, view, errors}) => {
    const [ping, setPing] = useState(0)
    useEffect(() => {
        if(errors){
            let frameconf = TerminusClient.View.document()
            frame.setErrors(errors, frameconf)
            setPing(ping+1)
        }
    },[errors])

    return (
        <table style={tabstyle}>
            <ObjectRenderer frame={frame.document} mode={mode} view={view} ping={ping}/>
        </table>
    )
}

export const ObjectRenderer = ({frame, mode, view, ping}) => {
    if(!frame) return null
    const [redraw, setRedraw] = useState(1)
    const [oid, setOid] = useState(frame.subject())
    const [otype, setOtype] = useState(frame.subjectClass())


    let showid = (view && view.show_id && (frame.depth() == 0) ? view.show_id : false) 
    let showtype = (view && view.show_type ? view.show_type : false)


    let headerstyle = {
        borderRadius: "6px 0 0 0",
        padding: "6px",
        backgroundColor: "#efefef",
        color: "#888"
    }


    let header2style = {
        padding: "6px",
        backgroundColor: "#efefef",
        color: "#888"
    }

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
            let pframe = frame.properties[p]
            //let nvframe = (Array.isArray(vframe) ? vframe[0] : vframe)
            props = props.concat(<PropertyRenderer ping={ping} view={view} key={p + "_property"} frame={pframe} mode={mode}/>)
        }
        return props
    }

    return <>
            <thead>
                <tr>
                    <th colSpan="2" style={headerstyle} title={frame.subject()}>
                        {frame.subjectClass()}
                    </th>
                    {mode=="edit" &&
                        <th style={headerstyle}>
                            <Row>
                                <Col>
                                    {getMissingPropertySelector()}
                                </Col>
                                <Col></Col>
                            </Row>
                        </th>
                    }
                </tr>
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


export const PropertyRenderer = ({frame, mode, view, ping}) => {
    if(!frame) return null
    const [redraw, setRedraw] = useState(1)
    const [rvals, setRvals] = useState()

    let delstyle = {
        padding: "2px",
        width: "16px",
        textAlign: "center"
    }

    let minusStyle = {
        color: "red",
        fontSize: "2em",
        backgroundColor: "white"
    }

    let plusStyle = {
        color: "green",
        fontSize: "1.3em",
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
                <button style={plusStyle} onClick={addValue}>+</button>
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
                    <td style={delstyle}><button style={minusStyle} onClick={getDelVal(i, rvals[i])}>-</button> </td>
                }
                <td key={frame.predicate  + "_value_" + i} style={valuestyle} >
                    <ValueRenderer redraw={redraw} frame={rvals[i]} mode={mode} view={view} ping={ping} />
                </td>
            </tr>)
        }
        else {
            rows.push(<tr key={frame.predicate + "_" + i}>
                {mode == "edit" &&
                    <td style={delstyle}>
                        <button style={minusStyle} onClick={getDelVal(i, rvals[i])}>-</button>
                    </td>
                }
                <td style={valuestyle}>
                    <ValueRenderer redraw={redraw} frame={rvals[i]} mode={mode} view={view} ping={ping} />
                </td>
            </tr>)
        }
    }
    return rows 
}

export const ValueRenderer = ({frame, mode, view, redraw, ping}) => {
    let [v, setV] = useState("")

    useEffect(() => setV(frame.get()), [redraw, frame])

    const updval = (vv) => {
        setV(vv)
        frame.set(vv)
    }
    if(!frame.isData()){
        return  <table style={tabstyle}>
            <ObjectRenderer frame={frame} mode={mode} view={view}/>
        </table>
    }
    else if(frame.isChoice()){  
        return <ChoiceRenderer val={v} frame={frame} mode={mode} updateVal={updval} view={view} />
    }
    else if(frame.isDocument()){
        return <DocumentRenderer val={v} frame={frame} mode={mode} updateVal={updval} view={view} />
    }
    else if(frame.isData()){
        return <DataRenderer frame={frame} val={v} type={frame.getType()} mode={mode} updateVal={updval} view={view} />
    }
    else {
        console.log("Frame has no known type", frame)
    }
}

export const DocumentRenderer = ({val, mode, frame, updateVal, view}) => {
    if(mode == "edit"){
        return <DataRenderer frame={frame} val={val} mode={mode} type={frame.getType()} updateVal={updateVal} />
    }
    else {
        let ds = function(){
            if(view.selectDocument) view.selectDocument(val)
        }
        let lstyle = {
            cursor: "pointer"
        }

        if(val === "") val = TerminusClient.UTILS.shorten(frame.getType())
        return <Row><Col>
            <span style={lstyle} onClick={ds}>{val}</span>
        </Col><Col></Col></Row>
    }
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

export const FrameError = ({error}) => {
    let msg = error && error['vio:message'] ? error['vio:message']["@value"] : error && error['api:message'] ? error['api:message'] : "Error with field" 
    return <span style={{color:"#f84848"}}>{msg}</span> 
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
        /></Col>
         <Col>
            {frame.errors &&
                <FrameErrors frame={frame} />
            }
            {!frame.errors && 
                <>{TerminusClient.UTILS.shorten(frame.range)}</>
            }
            </Col>
        </Row>

    }
    else {
        let tit = val
        let lab = val
        frame.frame.elements.map((item) => {
            if(TerminusClient.UTILS.compareIDs(item.class, val)){
                tit = val + (item.comment ? " - " + item.comment["@value"] : "")
                lab = (item.label ? item.label["@value"] : TerminusClient.UTILS.labelFromURL(item.class))
            }    
        })
        return <span title={tit}>{lab}</span>
    }
}

export const DataRenderer = ({val, mode, type, updateVal, frame}) => {
    
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
                {frame.errors &&
                    <FrameErrors frame={frame} />
                }
                {!frame.errors && 
                    <>{TerminusClient.UTILS.shorten(type)}</>
                }
            </Col>
        </Row>
    }
    else {
        if(val !== "") return val
        return TerminusClient.UTILS.shorten(type)

    }
}
