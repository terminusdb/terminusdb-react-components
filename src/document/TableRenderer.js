import React, {useState, useEffect} from 'react'
import {Row, Col} from "react-bootstrap" //replace
import TerminusClient from '@terminusdb/terminusdb-client'
import Select from 'react-select';
import {PLUS_STYLE, MINUS_STYLE, DEL_STYLE, TAB_STYLE, VALUE_STYLE, LABEL_STYLE, HEADER_STYLE, HEADER_TWO_STYLE} from "./frames.constants.js"

export const TableRenderer = ({frame, mode, view, errors, client, setExtractDocs}) => {

    const [ping, setPing] = useState(0)
    useEffect(() => {
        if(errors){
            let frameconf = TerminusClient.View.document()
            frame.setErrors(errors, frameconf)
            setPing(ping+1)
        }
    },[errors])

    return (<>
        <table style={TAB_STYLE}>
            <ObjectRenderer frame={frame.document} mode={mode} view={view} ping={ping} client={client} setExtractDocs={setExtractDocs}/>
        </table>

    </>)
}


const MissingPropertySelector = ({client, frame, onAddProp}) => {
    let arr=[]

    if(frame.isObject() && frame.classframes) return <div/>

    if(!frame.classframes) {
        let cls = frame.cls
        if (client) {
            client.getClassFrame(cls).then((results)=>{
                let classframe=results
                if((classframe && classframe['system:properties'])) {
                    for(var key in classframe['system:properties']){
                        arr.push({value: classframe['system:properties'][key].property, label: classframe['system:properties'][key].label["@value"], props: classframe['system:properties'][key]})
                    }
                }
            })

            return <Select
                onChange={onAddProp}
                options={arr}
                placeholder="Add Property"
            />
        }

    }
    else {
        let mpl=frame.getMissingPropertyList()

        return <Select
            onChange={onAddProp}
            options={mpl}
            placeholder="Add Property"
        />

    }

    return <div/>


}

export const ObjectRenderer = ({frame, mode, view, ping, setDocType, client, setExtractDocs}) => {
    if(!frame) return null

    const [redraw, setRedraw] = useState(1)
    const [oid, setOid] = useState(frame.subject())
    const [otype, setOtype] = useState(frame.subjectClass())

    let showid = (view && view.show_id && (frame.depth() == 0) ? view.show_id : false)
    let showtype = (view && view.show_type ? view.show_type : false)

    const onAddProp = (e) => {
        if(e.props) {
            var p = e.props
        }
        else{
            var p = e.value
        }
        frame.addProperty(p)
        setRedraw(redraw + 1)
    }

    const getMissingPropertySelectorOLD = () => {
        if(frame.type=="objectProperty") return null
        if(!frame.classframes) {
            let cls = frame.cls
            if (client) {
                client.getClassFrame(cls).then((results)=>{
                    let classframe=results, opts=[]
                    if((classframe && classframe['system:properties'])) {
                        for(var key in classframe['system:properties']){
                            opts.push(key.label)
                        }
                    }
                    var mpl=opts
                })
            }
        }
        else var mpl = frame.getMissingPropertyList()
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
            props = props.concat(<PropertyRenderer ping={ping} view={view} key={p + "_property"} frame={pframe} mode={mode} client={client} setExtractDocs={setExtractDocs}/>)
        }
        return props
    }

    return <>
            <thead>
                <tr>
                    <th colSpan="2" style={HEADER_STYLE} title={frame.subject()}>
                        {frame.subjectClass()}
                    </th>
                    {mode=="edit" &&
                        <th style={HEADER_STYLE}>
                            <Row>
                                <Col>
                                    <MissingPropertySelector client={client} frame={frame} onAddProp={onAddProp}/>
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
        <td style={LABEL_STYLE}>ID</td>
        {mode == "edit" &&
            <td></td>
        }
        <td style={VALUE_STYLE}>
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
        <td style={LABEL_STYLE}>Type</td>
        {mode == "edit" &&
            <td></td>
        }
        <td style={VALUE_STYLE}>
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

export const PropertyRenderer = ({frame, mode, view, ping, client, setExtractDocs}) => {
    if(!frame) return null

    const [redraw, setRedraw] = useState(1)
    const [rvals, setRvals] = useState()

    useEffect(() => setRvals(getPvals()), [frame, mode])

    if(!frame.getLabel){
        console.log("strange frame", frame)
        return null
    }

    function getLabelPart(index, vframe){

        return <td key={frame.predicate + "_label"} style={LABEL_STYLE} rowSpan={1}>
            {mode == "edit" &&
                <button style={PLUS_STYLE} onClick={getAddValue(index, vframe)}>+</button>
            }
            {frame.getLabel()}
        </td>
    }

    function getPvals(){
        let rvals = []
        for(var i = 0 ; i < frame.values.length; i++){
            rvals.push(frame.values[i])
        }
        if(!frame.values.length){
            rvals.push(frame.cframe)
        }
        return rvals
    }

    const addValue = (vframe) => {
        frame.addValueFrame(frame.createEmpty())
        setRvals(getPvals())
        setRedraw(redraw+1)
    }

    function getAddValue(index, vframe){
        let g = vframe.get()
        let f = function(){
            addValue(vframe, index)
        }
        return f
    }


     const deleteValue = (val, index) => {
        frame.removeValue(val)
        setRvals(getPvals())
        setRedraw(redraw+1)
     }

    function getDelVal(index, vframe){
        let g = vframe.get()
        let f = function(){
            deleteValue(vframe, index)
        }
        return f
    }

    if(!rvals || !rvals.length) return null
    let rows = []
    for(var i = 0 ; i < rvals.length; i++){
        if(i == 0){
            rows.push(<tr key={frame.predicate  + "_" + i}>
                {getLabelPart(i, rvals[i])}
                {mode == "edit" &&
                    <td style={DEL_STYLE}><button style={MINUS_STYLE} onClick={getDelVal(i, rvals[i])}>-</button> </td>
                }
                <td key={frame.predicate  + "_value_" + i} style={VALUE_STYLE} >
                    <ValueRenderer redraw={redraw} frame={rvals[i]} mode={mode} view={view} ping={ping} client={client} setExtractDocs={setExtractDocs}/>
                </td>
            </tr>)
        }
        else {
            rows.push(<tr key={frame.predicate + "_" + i}>
                <td style={LABEL_STYLE} rowSpan={1}/>
                {mode == "edit" && <>

                    <td style={DEL_STYLE}>
                        <button style={MINUS_STYLE} onClick={getDelVal(i, rvals[i])}>-</button>
                    </td>
                </>}
                <td style={VALUE_STYLE}>
                    <ValueRenderer redraw={redraw} frame={rvals[i]} mode={mode} view={view} ping={ping} client={client} setExtractDocs={setExtractDocs}/>
                </td>
            </tr>)
        }
    }
    return rows
}

export const ChoiceClassRenderer = ({frame, mode, view, redraw, ping, client, type, updateVal, setExtractDocs}) => {
    const [opts, setOpts]=useState([])
    const [classOpts, setClassOpts]=useState([])

    const [selectedDoc, setSelectedDoc]=useState()

    useEffect(() => {
        if(!client) return
        let WOQL = TerminusClient.WOQL
        let range = frame.range
        let q = WOQL.and(
            WOQL.lib().classes(),
            WOQL.sub(range, "v:Class ID").not().eq("v:Class ID", range)
        )
        client.query(q).then((results)=>{
            for(var i = 0; i<results.bindings.length; i++){
                opts.push({value: results.bindings[i]["Class ID"], label: results.bindings[i]["Class Name"]["@value"]})
            }
            setOpts(opts)
        }).catch((err) => {
            console.log("err", err)
        })

    }, [frame, client])

    function handleClass (e) {
        if(!client || !e.value) return
        let cls=e.value
        updateVal(cls)


       client.getClassFrame(cls).then((results)=>{
            let classframe=results
            let docobj = view.create(client)
            if((classframe && classframe['system:properties'])) {
                docobj.loadSchemaFrames(classframe['system:properties'])
                docobj.filterFrame()
            }
            if(setExtractDocs) setExtractDocs( arr => [...arr, docobj]);
            setSelectedDoc(docobj)

        }).catch((err) => {
            console.log("err", err)
        })
    }

    useEffect(() => {
        setClassOpts(opts)
    }, [opts])

    return <>
        <Row>
            <Col md={6}>
                <Select placeholder="Choose a class"
                    options={classOpts}
                    onChange={handleClass}/>
            </Col>
            <Col md={4}>
                {type &&
                    <>{TerminusClient.UTILS.shorten(type)}</>
                }
            </Col>
        </Row>
        {selectedDoc && <TableRenderer frame={selectedDoc} mode={mode} view = {view} client={client} />}
    </>
}

export const ValueRenderer = ({frame, mode, view, redraw, ping, client, setExtractDocs}) => {

    let [v, setV] = useState("")

    useEffect(() =>
        setV(frame.get()
    ), [redraw, frame])

    const updval = (vv) => {
        setV(vv)
        frame.set(vv)
    }

    if(!frame.isData()){
        if (frame.isClassChoice()){
            return  <ChoiceClassRenderer frame={frame} redraw={redraw} mode={mode} view={view} client={client} type={frame.getType()} updateVal={updval} setExtractDocs={setExtractDocs}/>
        }
        else {
            return  <table style={TAB_STYLE}>
                <ObjectRenderer frame={frame} mode={mode} view={view} client={client}/>
            </table>
        }
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
