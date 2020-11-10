import React,{useMemo} from 'react';
import TerminusClient from '@terminusdb/terminusdb-client';
import {TableComponent} from './TableComponent';
import { format } from "date-fns";

export const WOQLTable = ({bindings, result, view, query, limit, start, orderBy, totalRows, setLimits, setOrder, prefixes})=>{
    let wt = TerminusClient.View.table()
    if(view && view.rules)  wt.loadJSON(view.table, view.rules)
    let woqt = new TerminusClient.WOQLTable(false, wt)

    let pagenum = parseInt((start) / limit)
    let pages = parseInt((totalRows/limit)+1)  
    
    const [data, columns]  = useMemo(() => makeData(), [bindings, result])

    function makeData(){
        let qres = result || {bindings: bindings}
        view = view || {}
        let wr = new TerminusClient.WOQLResult(qres, query)
        woqt.setResult(wr, query)
        const columns = formatTableColumns(woqt)
        return [wr.rows(), columns];
    }

    function addColumnDimensions(item, col){
        let cstyle = woqt.getColumnDimensions(item)
        for(var k in cstyle){
            col[k] = cstyle[k]
        }
        return col
    }

    function formatTableColumns(){
        let colids = woqt.getColumnsToRender()
        let listOfColumns = colids.map((item, index) => {
            let col = {
                Header: woqt.getColumnHeaderContents(item) || item,
                id: item,
                accessor: item,
                selector: item,
                canSort: woqt.isSortableColumn(item),
                filterable: woqt.isFilterableColumn(item),
                Cell: function(props){
                    return renderCellValue(props, woqt)
                }
            }
            return addColumnDimensions(item, col, woqt)
        })
        let colstruct = {columns:listOfColumns}
        if(woqt.config.header()) colstruct.Header = woqt.config.header()
        else colstruct.Header = " "
        return [colstruct]
    }

    
    return(
        <TableComponent 
            data={data} 
            columns={columns} 
            view={woqt}
            orderBy={orderBy}
            pages={pages} 
            pageNumber={pagenum}
            setLimits={setLimits} 
            setOrder={setOrder}
        />
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
