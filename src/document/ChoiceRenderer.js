import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import TextareaAutosize from 'react-textarea-autosize';
import Select from "react-select"
import { ValueRow } from "./ValueRenderer"


export const ChoiceRenderer = ({val, deleteValue, mode, frame, updateVal, expansion, index, types, docs}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    const activeOn = () => setActive(true) 
    const activeOff = () => setActive(false) 
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

    let tindex = (expansion == "list" ? index + 1: false)
    let writeversion = <span className="wiki-choice-wrapper"><Select  
        className="wiki-chooser"
        defaultValue={val}
        isClearable={true}
        onChange={onChange} 
        options={opts}  
        placeholder={lab}
    /></span>
    let readversion = <span className="wiki-chooser-box">
        <span className="wiki-chooser-box-choice">{lab}</span>
    </span>

    return <ValueRow deleteValue={deleteValue} mode={mode} frame={frame} tindex={tindex} readversion={readversion} editversion={writeversion}/>
   
}
