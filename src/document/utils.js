import TerminusClient from '@terminusdb/terminusdb-client'
import React, {useState, useEffect} from 'react'

export function getTypeStruct(type, types){
    let rec = (types ? types[type] || types[TerminusClient.UTILS.unshorten[type]] : false)
    let meta = {}
    meta.id = TerminusClient.UTILS.shorten[type]
    if(rec){
        meta.label = rec && rec['Class Name'] ? rec['Class Name']["@value"] : meta.id 
        meta.comment = rec && rec['Description'] ? rec['Description']["@value"] : ""
    }
    else {
        meta.label = TerminusClient.UTILS.labelFromURL(type)
        meta.comment = ""
    }
    return meta 
}


export const FrameError = ({error}) => {
    let msg = error && error['vio:message'] ? error['vio:message']["@value"] : error && error['api:message'] ? error['api:message'] : "Error with field" 
    return <span className='wiki-error-contents'>{msg}</span> 
}


export const FrameErrors = ({frame, view}) => {
    if(!frame.errors){
        return null
    }
    let fes = []
    for(var i = 0; i<frame.errors.length; i++){
        fes.push(<FrameError error={frame.errors[i]} />)
    }
    return <span>{fes}</span> 
}

