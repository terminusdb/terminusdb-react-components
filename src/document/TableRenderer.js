import React, {useState, useEffect} from 'react'

export const TableRenderer = (frame, args) => {

    let tabstyle = {
        width: "100%",
    }
    let headerstyle = {
        padding: "6px",
        backgroundColor: "#efefef",
        color: "#888"
    }
    let labelstyle = {
        backgroundColor: "#efefef",
        fontWeight: 600,
        textAlign: "right",
        padding: "6px",
        borderBottom: "1px solid white",
        width: "150px"
    }

    let valuestyle = {
        padding: "0.5em"
        
    }

    const renderValue = (frame) => {
        if(frame.isData()){
            return frame.get()
		}
		else {
			return TableRenderer(frame) 			
		}
    }

    const renderProperty = (frame, p) => {
        let rows = []
        let labpart = <td style={labelstyle} rowspan={frame.values.length}>{frame.getLabel()}</td>
        for(var i = 0 ; i < frame.values.length; i++){
            if(i == 0){
                rows.push(<tr>
                    {labpart}
                    <td style={valuestyle} >{renderValue(frame.values[i])}</td>
                </tr>)
            }
            else {
                rows.push(<tr>
                    <td style={valuestyle}>{renderValue(frame.values[i])}</td>
                </tr>)
            }
        }
        return rows
    }


    const renderProperties = (frame) => {
        let props = []
        for(var p in frame.properties){
            let prows = renderProperty(frame.properties[p], p)
            props = props.concat(prows)
        }
        return props
    }

    return (
        <table style={tabstyle}>
            <thead>
                <tr><th colspan="2" style={headerstyle} title={frame.subject()}>{frame.subjectClass()}</th></tr>
            </thead>
            <tbody>
                {renderProperties(frame)}
            </tbody>
        </table>
    )
}
