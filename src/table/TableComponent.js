import React,{useEffect, useMemo} from 'react';
import { useTable, usePagination,  useSortBy } from 'react-table'
import { Table,Container,Row, Col, Pagination, PaginationItem, PaginationLink,Button} from "reactstrap";


export const TableComponent = ({columns, data, serverside})=>{

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
            manualPagination: serverside, // Tell the usePagination
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            //pageCount: controlledPageCount,
        },
        useSortBy, 
        usePagination,
    )    
      
        return (
            <span>
            <Table {...getTableProps()} hover>
                     <thead>
                        {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())} >
                                {column.render('Header')}
                                <span>
                                    {column.isSorted
                                    ? column.isSortedDesc
                                        ? ' 🔽'
                                        : ' 🔼'
                                    : ''}
                            </span>
                        </th>
                            ))}
                        </tr>
                        ))}
                    </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td style={{maxWidth:'150px'}} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </Table>
            <Row md={12} className="mr-0 ml-0">
            <Col md={6} >
                <Pagination className="pagination">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                      {'<'}
                    </button>{' '}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                      {'>'}
                    </button>{' '}
                </Pagination>
          </Col>
          <Col md={6} className="justify-content-end">
            <span>
            Page{' '}
            <strong>
                {pageIndex  + 1} of {pageCount}
            </strong>{' '}
            </span>
            <select value={pageSize}
                onChange={e => {
                setPageSize(Number(e.target.value))
            }}>
            {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        </Col>
      </Row>
    </span>
    )
}

