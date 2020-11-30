import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {TableRenderer} from "./TableRenderer"
import {FancyRenderer} from "./FancyRenderer"

export function FrameViewer(classframe, doc, view, edit, client){
    this.frame = view.create(client)
    this.mode = edit ? "edit" : "view"
    if((classframe && classframe['system:properties'])) {
        if(doc){
            this.frame.load(classframe['system:properties'], doc)
        }
        else {
            this.frame.loadSchemaFrames(classframe['system:properties'])
        }    
    }
    else {
        alert("No frames")
        console.log(classframe)
    }
    const getRenderer = (name, frame, args) => {
        const f = () => {
            if(name == "fancy"){
                return FancyRenderer(frame, this.mode, view)
            }
            return TableRenderer(frame, this.mode, view)
        }
        return f
    }    
    this.frame.filterFrame(getRenderer)
    return this
}

FrameViewer.prototype.render = function(){
    return this.frame.document.render() 
}

FrameViewer.prototype.extract = function(){
    return this.frame.document.extract() 
}

