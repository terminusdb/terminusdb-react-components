import React,{useMemo} from 'react';
import TerminusClient from '@terminusdb/terminusdb-client';
import {TableComponent} from './TableComponent';
import { format } from "date-fns";


export const CellRenderer = ({value, column, row, cell, view, args})=>{
    if(isEmptyValue(value)){
        //has it a special empty render?
        //otherwise just return empty string
        return ""
    }
    //else if(typeof value == "string" && isIRI(value, prefixes, true)){
        //if(view->hasDefinedEvent(.., .., "iri"))
        //do we compress it? ... if not advised against...
        //having compressed / or not it, we see if there is any specific IRI rendering rules
    //}
    else if(Array.isArray(value)){
        if(value.length == 1 && Array.isArray(value[0])){
            value = value[0]
        }
        return <ArrayRenderer value={value} depth={0} view={view} row={row} cell={cell} column={column} args={args} />
    }
    else if(typeof value == "object" && typeof value['@value'] != "undefined"){
        return <LiteralRenderer value={value} view={view} row={row} cell={cell} column={column} args={args} />            
    }
    else if(typeof value == "object" && typeof value['@type']){
        return <JSONLDRenderer jsonld={value} view={view} row={row} cell={cell} column={column} args={args} />            
    }
    return value
}

export const IRIRenderer = ({irival, column, row, cell, view, args})=>{
    /*if(!view.no_compress(row, col)){
        shirival = shorten(irival)
        if(shirival != irival){
            return <span className="shortened_iri" title={irival}>shirival</span>
        }
    }*/
    return <span className='iri'>irival</span>
}

export const JSONLDRenderer = ({value, column, row, cell, view, args})=>{
    return <span>{JSON.stringify(value, false, 2)}</span>
}


export const LiteralRenderer = ({value, column, row, cell, view, args})=>{
    return <span>{value['@value']}</span>
}

export const ArrayRenderer = ({value, column, row, cell, view, args})=>{
    if(isEmptyValue(value)){
        //has it a special empty render?
        //otherwise just return empty string
        return ""
    }
    if(typeof value == "string" && isIRI(value)){
        //do we compress it? ... if not advised against...
        //having compressed / or not it, we see if there is any specific IRI rendering rules
    }
}


function isEmptyValue(val){
    if(val == "system:unknown") return true        
    if(val === "") return true
    if(typeof val == "object" && val['@value'] === "") return true
    if(Array.isArray(val) && val.length == 0) return true
    if(Array.isArray(val) && val.length == 1 && isEmptyValue(val[i])) return true
    return false
}
//we have:
//IRI 
//[]
//{@value}
//{@type}
//Foreign Entity - spit it out...

/*
* to be review we have to pass the column type in the table config like
* {columnid:'Time', type:"seconds"} etc.....
*/
function checkTime(props){
    let strval=false
    if(props.cell.column
        && props.cell.column.id==="Time"
        && typeof props.cell.value==='object'
        && props.cell.value['@type']==='http://www.w3.org/2001/XMLSchema#decimal'){

        const ts=props.cell.value['@value']
        if(!isNaN(parseFloat(ts))){
            strval=format(new Date(parseFloat(ts*1000)), "hh:mm:ss, dd/MM/yy")
         }
    }
    return strval
}

function getStringFromBindingValue(item, first){
    if(Array.isArray(item)){
        return valueFromArray(item)
    }
    if(typeof item == "object"){
        if(typeof item['@value'] != "undefined"){
            let t = (item["@language"] ? "xsd:string" : item["@type"])
            return (<span title={t}>{item['@value']}</span>)
        }
        else {
            return item
            //return JSON.stringify(item, false, 2) 
        }
    }
    if(item == "terminus:unknown") return ""
    return item;
}

function valueFromArray(arr){
    let vals = arr.map((item) => {
        return getStringFromBindingValue(item)
    })
    return vals.join(", ")
}
