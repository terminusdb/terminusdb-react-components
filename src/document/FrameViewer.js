import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {TableRenderer} from "./TableRenderer"
import {FancyRenderer} from "./FancyRenderer"

export const FrameViewer = ({doc, classframe, view, client}) => {
    if(!(classframe && classframe['system:properties'])) return null
    let df = view.create(client)
    df.load(classframe['system:properties'], doc)
    df.filterFrame(getRenderer)
    df.document.sortProperties()
    return df.document.render() 
}

const getRenderer = (name, frame, args) => {
    const f = () => {
        if(name == "fancy"){
            return FancyRenderer(frame, args)
        }
        return TableRenderer(frame, args)
    }
    return f
}

