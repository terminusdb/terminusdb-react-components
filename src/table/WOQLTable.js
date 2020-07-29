import React,{useMemo} from 'react';
import TerminusClient from '@terminusdb/terminusdb-client';
import {TableComponent} from './TableComponent';
import { format } from "date-fns";

export const WOQLTable = ({bindings, view, query, serverside})=>{
    const [data , columns]  = useMemo(() => makeData(), [bindings])

    function makeData(){
        view = view || {}
        let wt = TerminusClient.View.table()
        if(view.rules)  wt.loadJSON(view.table, view.rules)
        let wr = new TerminusClient.WOQLResult({bindings: bindings},query)    
        let woqt = new TerminusClient.WOQLTable(false, wt)       
        woqt.setResult(wr, query)
        const columns = formatTableColumns(woqt)
        return [bindings, columns];
    }

    function formatTableColumns(woqt){
        let colids = woqt.getColumnsToRender()
        let listOfColumns = colids.map((item, index) => {
            return {
                Header: item,
                id: item,
                accessor: item,
                selector: item,
                canSort: woqt.isSortableColumn(item),
                filterable: woqt.isFilterableColumn(item),
                Cell: function(props){
                    return renderCellValue(props, woqt)
                }
            }
        })
        let colstruct = {columns:listOfColumns}
        if(woqt.config.header()) colstruct.Header = woqt.config.header()
        else colstruct.Header = " " 
        return [colstruct]
    }

    return(
    	<TableComponent data={data} columns={columns} />
    )
}
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

//cell values that come back from queries can have 
function renderCellValue(props, woqt){
    let value = props.cell.value || ""
    let strval = checkTime(props);
    if(strval===false)strval = getStringFromBindingValue(value);
    if(typeof strval == "undefined") return ""
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
            return JSON.stringify(item, false, 2) 
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
