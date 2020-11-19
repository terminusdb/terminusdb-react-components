import React, {useState, useEffect} from 'react'

export const FancyRenderer = (frame) => {

    const renderValue = (frame) => {
        if(frame.isData()){
            return frame.get()
		}
		else {
			return FancyRenderer(frame) 			
		}
    }

    const renderProperty = (frame, p) => {
        let rows = []
        let labpart = <td rowspan={frame.values.length}>{frame.getLabel()}</td>
        for(var i = 0 ; i < frame.values.length; i++){
            if(i == 0){
                rows.push(<tr>
                    {labpart}
                    <td>{renderValue(frame.values[i])}</td>
                </tr>)
            }
            else {
                rows.push(<tr>
                    <td>{renderValue(frame.values[i])}</td>
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
        <table border="1" width="100%">
            <thead>
                <tr><th colspan="2">{frame.subject() + ", " + frame.subjectClass()}</th></tr>
            </thead>
            <tbody>
                {renderProperties(frame)}
            </tbody>
        </table>
    )
}
