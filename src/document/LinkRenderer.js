
import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import TextareaAutosize from 'react-textarea-autosize';
import { ObjectRenderer } from "./ObjectRenderer"
import { Select } from "react-select"
import { DataRenderer } from "./DatatypeRenderer"


export const DocumentRenderer = ({val, mode, frame, updateVal, expansion, index, view, types, docs}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    const activeOn = () => setActive(true) 
    const activeOff = () => setActive(false) 
    return <DataRenderer frame={frame} val={val} mode={mode} type={frame.getType()} updateVal={updateVal} />
}





