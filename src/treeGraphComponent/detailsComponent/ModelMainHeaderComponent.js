import React, {useState, useEffect} from 'react';
import {ToogleButton} from './ToogleButton';
import {TOOLBAR_LABELS} from '../../constants/details-labels';
import {ADD_NEW_ENTITY,ADD_NEW_CLASS,ADD_NEW_CHOICE_CLASS} from '../utils/actionType'
import {CLASS_TYPE_NAME_LABEL,CLASS_TYPE_NAME} from '../utils/elementsName'
import {GraphContextObj} from '../hook/graphObjectContext'
import {DEFAULT_SCHEMA_VIEW} from '../../constants/details-labels'

export const ModelMainHeaderComponent =(props)=>{

	const {setNodeAction,resetTreeModel} = GraphContextObj();

	const viewEdit=props.isEditMode===true ? true : false;

	const [commitMessage,setCommitMessage]=useState('');
	const [showExtraTools, setShowExtraTools]=useState(false)

	const commitChange=(evt)=>{
		const value=evt.currentTarget.value
		setCommitMessage(value)

	}

	useEffect(() => {
		setShowExtraTools(true)
	}, [props.extraTools])

	let style={style:{visibility:'hidden'}}
		if(viewEdit){
			style={}
	}

	const saveData=()=>{
		props.saveData(commitMessage)
		setCommitMessage('')
	}

	const setZoomIn=()=>{
		props.setZoomEvent({type:'ZOOM_IN','zoom':Date.now()});

	}
	const setZoomOut=()=>{
		props.setZoomEvent({type:'ZOOM_OUT','zoom':Date.now()});

	}
	const setResetView=()=>{
		props.setZoomEvent({type:'RESET_ZOOM','zoom':Date.now()});
	}

	const addDocumentType=()=>{
		setNodeAction(ADD_NEW_ENTITY,CLASS_TYPE_NAME.SCHEMA_ROOT,true)
	}

	const addObjectType=()=>{
		setNodeAction(ADD_NEW_CLASS,CLASS_TYPE_NAME.SCHEMA_ROOT,true)
	}

	const addChoiceType=()=>{
		setNodeAction(ADD_NEW_CHOICE_CLASS,CLASS_TYPE_NAME.SCHEMA_ROOT,true)
	}

	return(
		   <div className="tdb__model__hright">
		   		<div className="tdb__model__hright">
			   		{showExtraTools && <>{props.extraTools}</>}
			   </div>
			   <div className="tdb__model__hright" {...style}>
			   		<div className="tdb__model__node tdb__model__node--doc" >
			   			<i className="custom-img-entities" title={`Add ${CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES}`} onClick={addDocumentType}></i>
			   		</div>
			   		<div className="tdb__model__node tdb__model__node--class" >
			   			<i className="custom-img-classes" title={`Add ${CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES}`} onClick={addObjectType}></i>
			   		</div>
			   		<div className="tdb__model__node tdb__model__node--choice" >
			   			<i className="custom-img-choice" title={`Add ${CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES}`} onClick={addChoiceType}></i>
			   		</div>
			   </div>
		   	   <div className="tdb__model__hright">
					{props.view==DEFAULT_SCHEMA_VIEW && <> <div className="icon-header" >
						<i className="fa fa-search-plus" title={TOOLBAR_LABELS.ZoomInTooltip}
						onClick={setZoomIn}></i>
					</div>
					<div className="icon-header" >
						<i className="fa fa-search-minus" title={TOOLBAR_LABELS.ZoomOutTooltip}
						onClick={setZoomOut}></i>
					</div>
					<div className="icon-header" >
						<i className="fa fa-circle-notch" title={TOOLBAR_LABELS.ResetViewPoint}
						onClick={setResetView}></i>
					</div> </>}
		   	   </div>
		   	   <div className="tdb__model__hright" {...style}>
			   	   {props.view==DEFAULT_SCHEMA_VIEW && <>
					   <div className="icon-header">
					   		<i className="fa fa-sync"
					   		title={TOOLBAR_LABELS.ResetButtonTooltip}
					   		onClick={e =>
	          					window.confirm("If you continue, you'll lose the schema's changes") &&
	          					resetTreeModel()
	        				}></i>
				   		</div>
					   <div className="tdb__model__savebox">
						   <input className="tdb__form__element" value={commitMessage} onChange={commitChange} placeholder="Add commit message" />
						   <div className="icon-header--abs" >
						   		<ToogleButton baseTooltip={TOOLBAR_LABELS.SaveButtonTooltip}
						   					  baseIcon="fa fa-save"
						   					  selectIcon="fa fa-save"
						   					  isSelected={false}
						   					  selectClassName="tdb__button__base tdb__panel__button"
						   					  name="SAVE_BUTTON" onSelectionChange={saveData}/>
						   </div>
						</div>
					</>}

				   {/*
				   <div className="icon-header" >
				   		<i className="fa fa-undo" title={TOOLBAR_LABELS.UndoButtonTooltip} onClick={props.undoAction}></i>
				   </div>
				   <div className="icon-header" >
				   		<i className="fa fa-redo" title={TOOLBAR_LABELS.RedoButtonTooltip}  onClick={props.redoAction}></i>
				   </div>*/}
			   </div>

			   {props.view==DEFAULT_SCHEMA_VIEW && <div className="icon-header">
			   	  <ToogleButton	 onSelectionChange={props.changeMode}
		   	   					 baseTooltip={TOOLBAR_LABELS.EditModeTooltip}
		   	                     selectedTooltip={TOOLBAR_LABELS.ViewModeTooltip}
		   	                     baseIcon="fa fa-edit"
		   	                     selectIcon="fa fa-edit"
		   	                     isSelected={viewEdit}/>
			   </div>}

			   {props.view==DEFAULT_SCHEMA_VIEW && <div className="tdb__model__iclose">
			   		<ToogleButton name="PANEL_OPEN_BUTTON"
			   					  isSelected={props.panelIsOpen}
			   					  baseIcon="fas fa-sign-in-alt fa-flip-horizontal"
			   					  selectIcon="fas fa-sign-in-alt"
			   					  onSelectionChange={props.openClosePanel}/>
			   	</div>}
			</div>
		)
}
