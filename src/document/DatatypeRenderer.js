import React, {useState, useEffect, useRef} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import TextareaAutosize from 'react-textarea-autosize';
import { getTypeStruct } from "./utils"

export const DatatypeFrameRenderer = ({frame, mode}) => { 
    const [val, setV] = useState(frame.get())
    const [type, setT] = useState(frame.getType())
    const [lang, setL] = useState(frame.language || false)
    const [options, setOptions] = useState(frame.display_options || {})

    useEffect(() => {
        setV(frame.get())
        setT(frame.getType())
        setL(frame.language || false)
        setOptions(frame.display_options || {})
    }, [frame])

    const upd = (v, t, l) => {
        if(frame.controls && frame.controls.delete && v != val && v === ""){
            frame.controls.delete()
        }
        else if(frame.controls && frame.controls.update){
            if(v != val || (t && t!= type) || (l && lang != l)){
                frame.controls.update(v, t, l)
            }
        }
    }

    return <DatatypeRenderer 
        val={val} 
        type={type} 
        mode={mode} 
        lang={lang} 
        options={options} 
        onChange={upd} 
    /> 
}

export const DatatypeRenderer = ({val, type, lang, mode, options, onChange}) => { 
    const [value, setValue] = useState(val)   
    const [dtype, setDtype] = useState(type)   
    const [language, setLanguage] = useState(lang)   
       
    let onChangeValue = function(nv){
        if(nv != value){
            setValue(nv)
            onChange(nv, dtype, language)
        }
    }
    let viewer = getRendererForSituation(val, type, lang, mode, options)
    //let tmeta = getTypeStruct(type, types)
    let content = value
    if(viewer == "resizable_string"){
        return <ResizableStringInput val={value} onChange={onChangeValue} options={options} />
    }
    else if(viewer == "iri"){
        return <IRIInput mode={mode} val={value} onChange={onChangeValue} options={options} />
    }
    return <span className='wiki-simple-value'>{value}</span>
}

export const IRIInput = ({val, onChange, options}) => {
    return <StringInput val={val} onChange={onChange} options={options} />
}

function getRendererForSituation(val, type, lang, mode, options){
    if(options && options.dataviewer) return options.dataviewer
    if(mode == "edit") {
        return "resizable_string"
    }
    return false
}

export const StringInput = ({val, onChange, options}) => {
    const mv = (val ? "" + val : "")
    const ph = (options && options.placeholder ? options.placeholder : "")
    const cname = "wiki wiki-text wiki-input" + (options && options.className ? " " + options.className : "")
    
    const commitChange = (e) => {
        if(e.target.value != mv){
            onChange(e.target.value)
        }
    }
    
    const checkSubmit = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            commitChange(e)
        }
    }
    return <input  
        onBlur={commitChange}
        onKeyPress={checkSubmit} 
        className={cname}
        placeholder={ph}
        defaultValue={mv} 
    />
}

export const ResizableStringInput = ({val, onChange, options}) => {
    const mv = (val ? "" + val : "")
    const ph = (options && options.placeholder ? options.placeholder : "")
    const cname = "wiki wiki-textarea wiki-input" + (options && options.className ? " " + options.className : "")
    
    const commitChange = (e) => {
        if(e.target.value != mv){
            onChange(e.target.value)
        }
    }
    
    const checkSubmit = (e) => {
        if(e.key === 'Enter'){
            if(e.ctrlKey || options.singleline){
                e.preventDefault()
                commitChange(e)
            }
        }
    }

    return <TextareaAutosize 
        minRows={1}
        onBlur={commitChange}
        onKeyPress={checkSubmit} 
        className={cname}
        placeholder={ph} >
            {mv}
        </TextareaAutosize>
} 
