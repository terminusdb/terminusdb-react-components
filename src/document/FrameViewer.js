import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {TableRenderer} from "./TableRenderer"
import {FancyRenderer} from "./FancyRenderer"

export function FrameViewer({classframe, doc, type, view, mode, errors, extract, onExtract, client}){
    const [docobj, setDocObj] = useState()

    useEffect(() => {
        if(extract && onExtract && docobj ){
            let ext = docobj.document.extract()
            onExtract(ext)
        }
    }, [extract])

    useEffect(() => {
        if(errors){
            console.log("errors", errors)
        }
    }, [errors])


    useEffect(() => {
        if(classframe && view){
            let docobj = view.create(client)
            if((classframe && classframe['system:properties'])) {
                if(doc){
                    docobj.load(classframe['system:properties'], doc)
                }
                else {
                    docobj.loadSchemaFrames(classframe['system:properties'])
                }    
                docobj.filterFrame()
            }
            setDocObj(docobj)
        }
    }, [doc, view, classframe])
    if(!docobj) return null
    let docconf = TerminusClient.View.document()
    docconf.all()
    if(type == "fancy"){
        return <FancyRenderer frame={docobj} mode={mode} view = {view} errors={errors} client={client}/> 
    }
    else {
        return <TableRenderer frame={docobj} mode={mode} view = {view} errors={errors} />
    }
}