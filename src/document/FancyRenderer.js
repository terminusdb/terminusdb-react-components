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
    const [active, setActive] = useState(false)

    const toggleActive = () => setActive(!active) 

    let type = TerminusClient.UTILS.shorten(frame.subjectClass())
    let lab = frame.first("rdfs:label")
    let desc = frame.first("rdfs:comment")
    let id = TerminusClient.UTILS.shorten(frame.subject())



    //if(mode == "edit"){
        return <Row onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
            <Col md={1}>{active && 
                <PageActions />
            }
            </Col>
            <Col md={10}>
                <TextareaAutosize minRows={1} className="wiki wiki-title" placeholder={"Enter " + type + "  name"} >{lab}</TextareaAutosize>
                <TextareaAutosize minRows={1} className="wiki wiki-description" placeholder={"Enter " + type + " description"} >{desc}</TextareaAutosize>
            </Col>
            <Col md={1}>
                {active && 
                    <PageActions />
                }
            </Col>
        </Row>
}

export const PageActions = ({frame, mode, view}) => {
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

    return <button>+</button>
}

export const ObjectSummary = ({frame, mode, view}) => {
    return <Row><Col>yo</Col></Row> 
}

export const ObjectHeader = ({frame, mode, view}) => {
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
    return null
    return <Row><Col>yo</Col></Row> 
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


export const ObjectRenderer = ({frame, mode, view}) => {
    if(!frame) return null
    const [redraw, setRedraw] = useState(1)


    const initiallyExpanded = (frame) => {
        if(frame.depth() == 0){
            return true
        }
        return !frame.display_options.collapse
    }

    const [expanded, setExpanded] = useState(initiallyExpanded(frame))

    const renderProperties = () => {
        let props = []
        for(var p in frame.properties){
            let vframe = frame.properties[p]
            if(Array.isArray(vframe)) vframe=vframe[0]
            if(p != "rdfs:label" && p != "rdfs:comment"){
                props = props.concat(<PropertyRenderer view={view} key={p + "_property"} frame={vframe} mode={mode}/>)
            }
        }
        return props
    }

    if(!expanded){
        return <ObjectSummary  view={view} frame={frame} mode={mode} />
    }
    else {
        let props = renderProperties()
        return <><ObjectHeader view={view} frame={frame} mode={mode} />{props}</>
    }
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
            rows.push(
                <ValueRenderer key={frame.predicate  + "_" + i} redraw={redraw} frame={rvals[i]} mode={mode} view={view}/>
            )
    }
    return <><PropertyHeader frame={frame} mode={mode} view={view} />
    {rows}</>
}

export const PropertyHeader = ({frame, mode, view, index}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    const getHeaderTag = () => {
        let l = frame.depth() + 2
        let cname = "wiki-property-header wiki-propery-header-" + l 
        return <div className={cname}>{frame.getLabel()}</div>
    }
    return <Row onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
    <Col md={1}>{active && 
        <PageActions />
    }
    </Col>
    <Col md={10}>
        {getHeaderTag()}
    </Col>
    <Col md={1}>
        {active && 
            <PageActions />
        }
    </Col>
</Row>
}

export const ValueRenderer = ({frame, mode, view, redraw}) => {
    let [v, setV] = useState(false)

    useEffect(() => setV(frame.get()), [redraw, frame])

    const updval = (vv) => {
        setV(vv)
        frame.set(vv)            
    }
    if(v === false) return null
    if(!frame.isData()){
        return <ObjectRenderer frame={frame} view={view} mode={mode} /> 			
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
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    return <DataRenderer val={val} mode={mode} type={frame.getType()} updateVal={updateVal} />
}

export const ChoiceRenderer = ({val, mode, frame, updateVal}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
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

    return <Row onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
    <Col md={1}>{active && 
        <PageActions />
    }
    </Col>
    <Col md={10}>
        <Select  
            defaultValue={val}
            isClearable={true}
            onChange={onChange} 
            options={opts}  
            placeholder={lab}
        />
    </Col>
    <Col md={1}>
        {active && 
            <PageActions />
        }
    </Col>
</Row>
   
}

export const DataRenderer = ({val, mode, type, updateVal}) => {    
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    let onc = function(e){
        updateVal(e.target.value)
    }
    let mv = (val ? "" + val : "")
    return <Row onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
            <Col md={1}>{active && 
                <PageActions />
            }
            </Col>
            <Col md={10}>
                <TextareaAutosize minRows={1} className="wiki wiki-property" placeholder={"Enter " + type + "  name"} >{mv}</TextareaAutosize>
            </Col>
            <Col md={1}>
                {active && 
                    <PageActions />
                }
            </Col>
        </Row>
}
  

