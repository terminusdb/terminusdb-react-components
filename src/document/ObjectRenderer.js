import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import TerminusClient from '@terminusdb/terminusdb-client'
import { AiOutlineMenu, AiOutlinePlus, AiOutlineDown, AiOutlineRight, AiOutlineIdcard, AiOutlineUnorderedList, AiOutlineBuild, AiFillBuild } from "react-icons/ai";
import { PropertyRenderer } from "./PropertyRenderer"
import { addFrameControl, getTypeStruct, getDocStruct, WikiRow, hasControl, 
    getMissingPropertySelector, getFilledPropertySelector, StatusIndicator, getDocLabel} from "./utils"
import OutsideClickHandler from 'react-outside-click-handler';
import { DatatypeRenderer } from "./DatatypeRenderer"
import { shortenedText } from "../table/CellRenderer"
import {RiDeleteBin5Line} from "react-icons/ri"

export const ObjectRenderer = ({frame, mode, docs, types, autosave, ping, onDelete}) => {
    if(!frame) return null

    const initiallyExpanded = (frame) => {
        if(frame.depth() == 0){
            return true
        }
        return !(frame.display_options && frame.display_options.collapse)
    }

    const initialViewer = (frame) => {
        return "frame"
    }

    const [redraw, setRedraw] = useState(1)
    const [active, setActive] = useState(false)
    const [highlighted, setHighlighted] = useState()
    const [expanded, setExpanded] = useState(initiallyExpanded(frame))
    const [viewer, setViewer] = useState(initialViewer(frame))
    const activate = () => setActive(true)
    const deactivate = () => setActive(false)

    const getDelProp = (p) => {
        return () => {
            frame.removeProperty(p)
            setRedraw(redraw + 1)
        }
    }

    const onAddProp = (val) => {
        frame.addProperty(val)
        setRedraw(redraw + 1)
    }

    const addFrameProperty = () => {
        let txt = getDocLabel(frame, types, docs)
        txt = "Add property to " + txt
        return getMissingPropertySelector(frame, onAddProp, txt)
    }   

    useEffect(() => {
        if(frame){
            if(!frame.controls){
                frame.controls = {}
            }
            if(autosave && autosave.delete && !frame.controls.delete){
                let deldoc = () => {
                    autosave.delete(frame, "Document deleted with wiki console")
                    .then((r) => {
                        frame.status = "deleted"
                        if(onDelete) onDelete()
                    })
                    .catch((e) => {
                        frame.status = "error"
                        setStatus(frame.status)
                        console.log(e)
                    })
                }
                addFrameControl(frame, "delete", deldoc)    
            }
            if(autosave && autosave.save && frame.controls.save){
                let upddoc = () => {
                    autosave.save(frame, "Document updated with wiki console")
                    .then((r) => {
                        frame.status = "deleted"
                        if(onDelete) onDelete()
                    })
                    .catch((e) => {
                        frame.status = "error"
                        setStatus(frame.status)
                        console.log(e)
                    })
                }
                addFrameControl(frame, "update", upddoc)    
            }
            if(!frame.controls.addProperty) addFrameControl(frame, "addProperty", addFrameProperty)
            addFrameControl(frame, "highlighted", highlighted)    
            addFrameControl(frame, "setHighlighted", setHighlighted)
            addFrameControl(frame, "expanded", expanded)    
            addFrameControl(frame, "setExpanded", setExpanded)        
            for(var p in frame.properties){
                addControlsToPropertyFrame(frame, frame.properties[p])
            }                    
        }
    }, [frame])


    const getViewSelector = () => {
        let built_in_opts = [
            {'label': "Wiki View", value: "frame"},
            {'label': "Table", value: "table"},
            {'label': "JSON", value: "json"}
        ]

        function onChangeView(e){
            alert("view " + e.value)
        }

        let text = viewer + " selected"
        return <Select
            defaultValue={viewer}  
            onChange={onChangeView} 
            options={built_in_opts}  
            placeholder={text}
        />
    }

    const renderProperties = () => {
        let props = frame.sortProperties();
        let nprops = []
	    for (let i = 0; i < props.length; i++) {
            let vframe = frame.properties[props[i]]
            if(vframe && !(vframe.display_options && vframe.display_options.hidden)){
                //vframe.controls = getPropertyFrameControls(props[i], vframe)
                let nprop = <PropertyRenderer 
                    redraw={redraw} 
                    types={types} 
                    docs={docs} 
                    key={props[i] + "_property"} 
                    frame={vframe} 
                    mode={mode}
                    autosave={autosave}
                />
                if(nprop) nprops = nprops.concat(nprop)
            }
        }
        return nprops
    }

    let wrapper_class = (highlighted ? "wiki-object-highlighted" : 
        (active ? "wiki-object-selected" : ""))

    return <div className={"wiki-object-wrapper " + wrapper_class} onMouseEnter={activate} onMouseLeave={deactivate}>
        {frame.depth() > 0 && 
            <ObjectHeader frame={frame} mode={mode} types={types} docs={docs} active={active} />
        }
        {expanded != "compressed" && 
            <div className={wrapper_class + "-properties"}>
                {renderProperties()}
            </div>
        }
    </div>
}

function addControlsToPropertyFrame(frame, vframe){
    if(!frame.controls) return
    if(!vframe.controls) vframe.controls = {}
    if(frame.controls.addProperty) vframe.controls.addProperty = frame.controls.addProperty
}

export const ObjectHeader = ({frame, mode, types, docs, active}) => {
    const [localActive, setActive] = useState(false)
    const activate = () => setActive(true)
    const deactivate = () => setActive(false)

    let menus = <ObjectActions frame={frame} mode={mode} types={types} docs={docs} active={localActive}/>
    let navigation = <ObjectNavigation frame={frame} mode={mode} types={types} docs={docs} active={active} />
    return <div className="wiki-object-header" onMouseEnter={activate} onMouseLeave={deactivate}>
        <WikiRow 
            menus={menus}
            navigation ={navigation}
            active={active}
            type="object"
        >
            <ObjectTitle frame={frame} mode={mode} types={types} docs={docs} />
            {!frame.expanded && 
                <ObjectSummary frame={frame} mode={mode} types={types} docs={docs}/>    
            }
        </WikiRow>
    </div>
}

export const ObjectTitle = ({frame, mode, types, docs}) => {
    const [oid, setOid] = useState(frame.subject())
    let showid = false
    let showtype = false

    const updateID = (nid) => {
        frame.subjid = nid
        setOid(nid)
    } 

    const updateType = (ntype) => {
        frame.cls = ntype
        setOtype(ntype)
    } 
    return <span className="wiki-object-title">
        <TypeRenderer frame={frame} mode={mode} types={types} docs={docs} />
        <IDRenderer frame={frame} mode={mode} types={types} docs={docs} />
        <ObjectStats frame={frame} mode={mode} types={types} docs={docs} />
    </span>
}


export const TypeRenderer = ({frame, mode, types, docs}) => {
    let tstruct = getTypeStruct(frame.cls, types)
    let desc = tstruct.id + ". " + (tstruct.description || "")
    return <span className='wiki-type-tile' title={desc}>{tstruct.label}</span>
}


export const IDRenderer = ({frame, mode, types, docs}) => {
    let onc = function(val){
        if(val.indexOf(":") == -1) val = "doc:" + val
        frame.subjid = TerminusClient.UTILS.unshorten(val)
    }
    let tstruct = getTypeStruct(frame.cls, types)
    let val = TerminusClient.UTILS.shorten(frame.subjid)
    if(mode == "edit"){
        if(!frame.display_options) frame.display_options = {}
        frame.display_options.placeholder = "Enter " + tstruct.label + " ID"   
        frame.display_options.dataviewer = "iri"       
    }
    return <span className="wiki-id-tile">
        <span className="wiki-icon">
            <AiOutlineIdcard />
        </span>
        <span className="wiki-id-editor">
            <DatatypeRenderer val={val} mode={mode} options={frame.display_options} onChange={onc} />
        </span>
    </span>
}

export const ObjectStats = ({frame, mode, types, docs}) => {
    let props = Object.keys(frame.properties).length
    let ptitle = (props == 1) ? "Property" : "Properties"
    let vals = 0;
    for(var k in frame.properties){
        vals += frame.properties[k].values.length
    }
    let sz = TerminusClient.UTILS.TypeHelper.formatBytes(JSON.stringify(frame.extract()).length)
    let vtitle = (vals == 1) ? "Value" : "Values"
    return <span className="wiki-object-stats">
        <span className='wiki-icon wiki-stats-icon wiki-props-icon' title={ptitle}>
            <AiOutlineUnorderedList  className='wiki-ricon' /> {props}
        </span>
        <span className='wiki-icon wiki-stats-icon wiki-values-icon' title={vtitle}>
           <AiOutlineBuild  className='wiki-ricon' /> {vals}
        </span>
        <span className='wiki-icon wiki-stats-icon wiki-size-icon' title={sz}>
            <AiFillBuild className='wiki-ricon'/> {sz}
        </span>
    </span>
}

export const ObjectSummary = ({frame, mode, view, types, docs, toggleExpanded}) => {
    const [active, setActive] = useState(false)
    const toggleActive = () => { setActive(!active) } 
    let ps = frame.getProperties("filled")
    let sample1, sample2, s1name, s2name
    if(ps.length > 0){
        sample1 = frame.properties[ps[0]].values[0]
        s1name = frame.properties[ps[0]].getLabel()
        if(ps.length > 1){
            sample2 = frame.properties[ps[1]].values[0]
            s2name = frame.properties[ps[1]].getLabel()
        }
        else {
            if(frame.properties[ps[0]].values.length > 1){
                sample2 = frame.properties[ps[0]].values[1]
                s2name = s1name
            }
        }
    }
    if(!sample1) return null
    return <span className="wiki-summary-tiles">
        <SummarySample label={s1name} value={sample1} />
        {sample2 && 
            <SummarySample label={s2name} value={sample2} />
        }
    </span>
}

export const SummarySample = ({label, value}) => {
    let x = value.get() 
    let val = shortenedText(x, 20)
    return <span className="wiki-summary-sample">
        <span className="wiki-summary-label">{label} </span>
        <span className="wiki-summary-value"> {val}</span>
    </span>
}

export const ObjectStatus = ({frame, mode}) => {
    let ptitle = frame.status
    return <span className="wiki-object-status">
        <span className='wiki-icon wiki-status-icon' title={ptitle}>
            {ptitle}
        </span>
    </span>
}

export const ObjectActions = ({frame, mode, status, types, docs, active}) => {
    const [showMenu, setShowMenu] = useState(status=="loading")
    const toggleMenu = () => {
        if(status != "loading"){
            setShowMenu(!showMenu)
            if(hasControl(frame, "setHighlighted")) frame.controls.setHighlighted(!showMenu)
        }
        else setShowMenu(false)
    }  

    return <span className="wiki-left-contents">
        {active &&  
            <StatusIndicator type="object" status={status} />
        }
        {active && frame && (mode == "edit") &&
            <span className="wiki-left-icon" onClick={toggleMenu}><AiOutlineMenu /></span>
        }
        {showMenu &&
            <ObjectActionMenu frame={frame} toggle={toggleMenu} types={types} docs={docs} />            
        }
    </span>
}


export const ObjectActionMenu = ({frame, toggle, types, docs}) => {   
    const what = frame.getLabel() || type
    const docname = getDocLabel(frame, types, docs)

    return <OutsideClickHandler onOutsideClick={toggle} >  
        <div className="wiki-menu">
            {hasControl(frame, 'delete') &&                    
                <div className="wiki-menu-entry wiki-menu-delete" onClick={hasControl(frame, 'delete')}>
                    <RiDeleteBin5Line className='wiki-menu-icon'/> Delete {docname}
                </div>                  
            }
            {hasControl(frame, 'duplicate') &&                    
                <div className="wiki-menu-entry wiki-menu-duplicate" onClick={hasControl(frame, 'duplicate')}>
                    <AiOutlineCopy className='wiki-menu-icon'/> Clone {docname}
                </div>    
            }              
            {(hasControl(frame, 'duplicate') || hasControl(frame, 'delete')) && 
                <div className="wiki-menu-spacer"></div>
            }
            {hasControl(frame, 'addValue') && 
                <>                    
                    <div className="wiki-menu-entry wiki-menu-add" onClick={hasControl(frame, 'addValue')}>
                        <AiOutlinePlus className='wiki-menu-icon'/> Add {what}
                    </div>                  
                    <div className="wiki-menu-spacer"></div>
                </>
            }
            {hasControl(frame, 'getViewSelector') &&                    
                <>
                    <div className="wiki-menu-selector wiki-menu-addparent">
                        {ViewChooser}
                    </div>
                    <div className="wiki-menu-spacer"></div>
                </>
            }
            {hasControl(frame, 'addProperty') &&                    
                <div className="wiki-menu-selector wiki-menu-addparent">
                        {hasControl(frame, 'addProperty')()}
                </div>
            }
        </div>
    </OutsideClickHandler>
}

export const ObjectNavigation = ({frame, mode, view, types}) => {
    if(!(frame && frame.controls)) return null
    const [compressed, setCompressed] = useState(frame.controls.compressed || "block")
    let toggle = () => {
        if(compressed != "compressed"){
            frame.controls.setCompressed("compressed")
            setCompressed("compressed")
        }
        else {
            frame.controls.setCompressed("block")
            setCompressed("block")
        }
    } 
    return <span className="wiki-right-contents">
        {compressed != "compressed" &&  
            <span className="wiki-right-icon" onClick={toggle}><AiOutlineDown /></span>
        }
        {compressed == "compressed"  && 
            <span className="wiki-right-icon" onClick={toggle}><AiOutlineRight /></span>
        }
    </span>
}
