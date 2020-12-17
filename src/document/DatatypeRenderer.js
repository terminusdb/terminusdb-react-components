import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import TextareaAutosize from 'react-textarea-autosize';
import { ObjectRenderer } from "./ObjectRenderer"
import { Select } from "react-select"
import { ValueRow, ValueNavigation, PageActions } from "./ValueRenderer"
import { getTypeStruct } from "./utils"

export const DataRenderer = ({val, deleteValue, mode, type, updateVal, types, docs, frame, expansion, index}) => {    
    const [active, setActive] = useState(false)
    const toggleActive = () => setActive(!active) 
    let onc = function(e){
        updateVal(e.target.value)
    }
    let mv = (val ? "" + val : "")
    let tmeta = getTypeStruct(type, types)
    let tindex = (expansion == "list" ? index + 1: false)

    return <Row className="wiki-value-row" onMouseEnter={toggleActive} onMouseLeave={toggleActive}>
            <Col md={1}>{active && 
                <PageActions frame={frame} />
            }
            </Col>
            <Col md={10}>
                {tindex !== false && 
                    <span className='wiki-index wiki-data-index'>{tindex}</span>
                }
                <TextareaAutosize minRows={1} className="wiki wiki-property" placeholder={tmeta.label} >{mv}</TextareaAutosize>
            </Col>
            <Col md={1}>
                {active && 
                    <ValueNavigation frame={frame} deleteValue={deleteValue} />
                }
            </Col>
    </Row>
}
  
