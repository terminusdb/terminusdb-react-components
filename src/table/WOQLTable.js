import React,{useMemo} from 'react';
import TerminusClient from '@terminusdb/terminusdb-client';
import {TableComponent} from './TableComponent';
import { CellRenderer } from "./CellRenderer"

export const WOQLTable = ({bindings, result, view, freewidth, query, start, limit, orderBy, totalRows, setLimits, setOrder, prefixes})=>{
    //console.log(prefixes, query['@context'])
    prefixes = prefixes || (query && query['@context'] ? query['@context'] : {})
    let wt = TerminusClient.View.table()
    if(view && view.rules)  wt.loadJSON(view.table, view.rules)
    let woqt = new TerminusClient.WOQLTable(false, wt)
    let pagenum = (limit ? parseInt((start) / limit) : 1)
    let pages = (limit ? parseInt(((totalRows)/limit)+1) : 1)  
    
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

    function renderCellValue(props, woqt){
        let rend = woqt.getSpecificRender(props.cell.column.id, props.cell.row.original)
        if(rend){
            return rend(props.cell)
        }
        else {
            let rendargs = woqt.getRenderer(props.cell.column.id, props.cell.row.original)
            if(typeof props.cell.value == "string" || Array.isArray(props.cell.value) || 
                (typeof props.cell.value == "object" && (props.cell.value['@type'] || 
                typeof props.cell.value['@value'] != "undefined"))){
                    return <CellRenderer 
                        args={rendargs} 
                        value={props.cell.value}
                        column={props.cell.column.id} 
                        row={props.cell.row.original} 
                        view={woqt} 
                        cell={props.cell}
                    />                 
            }
            return props.cell.value
        }
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
                Cell: function(props){
                    return renderCellValue(props, woqt)
                }
            }
            if(freewidth) return col
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
            freewidth={freewidth}
            view={woqt}
            orderBy={orderBy}
            pages={pages} 
            pageNumber={pagenum}
            rowCount={totalRows}
            setLimits={setLimits} 
            setOrder={setOrder}
        />
    )
}

