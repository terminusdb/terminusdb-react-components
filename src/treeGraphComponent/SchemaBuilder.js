import React,{useState} from 'react';
import { SizeMe } from 'react-sizeme' 
import SplitPane from "react-split-pane";
import {ModelTreeComponent} from './ModelTreeComponent';
import {DetailsModelComponent} from './detailsComponent/DetailsModelComponent';
import {ADD_NEW_ENTITY,ADD_NEW_CLASS,ADD_PARENT,ADD_CHILD} from './node/NodeConstants';
import {GraphContextObj} from './hook/graphObjectContext';
import {TERMINUS_FONT_BASE} from '../constants/details-labels';
import {ModelMainHeaderComponent} from './detailsComponent/ModelMainHeaderComponent';
import {InfoBoxComponent} from './detailsComponent/InfoBoxComponent'
import {ObjectClassModelViewMode} from './detailsComponent/viewMode/ObjectClassModelViewMode'

export const SchemaBuilder = (props)=>{

	const {graphDataProvider, 
		  setNodeAction, 
		  graphUpdateLabel,
		  selectedNodeObject,
		  changeCurrentNode,
		  updateValue,
		  classPropertiesList,
		  addNewProperty,
		  removeElement,
		  objectPropertyList,
		  objPropsRelatedToClass,
		  savedObjectToWOQL,updateChoices
		  //updateParentsList,availableParentsList
		  //entitiesListArr,classesListArr
		  } = GraphContextObj();

	const [isEditMode,setIsEditMode]=useState(false)
	const saveData=()=>{
		const query = savedObjectToWOQL();
		if(props.saveGraph)props.saveGraph(query)
	}
	
	const panelIsOpen=props.panelIsOpen || true;

	const mainPanelSize=panelIsOpen ? "calc(100% - 450px)" : "100%";
	const treeMainGraphObj=props.treeMainGraphObj;

	let showInfoComp=false
	if(!selectedNodeObject || !selectedNodeObject.name || selectedNodeObject.type==='Root' ||
		 selectedNodeObject.type==='Group'){

		showInfoComp=true;

	}

	return (	
		<>
		<div className="tdb__model__header">
			<ModelMainHeaderComponent saveData={saveData} changeMode={setIsEditMode} isEditMode={isEditMode}/>
		</div>
		<SplitPane className="colWindow" split="vertical" minSize={400} size={mainPanelSize}>							   							
			<div>
				<SizeMe monitorHeight={true}>{({ size }) =>
		            <div style={{ minHeight:"400px", height: "calc(100vh - 10px)"}}>
		              {graphDataProvider && 
		              	<ModelTreeComponent
		              		isEditMode={isEditMode}
		              		setNodeAction={setNodeAction} 
		              		selectedNodeObject={selectedNodeObject} 
		              		changeCurrentNode={changeCurrentNode} 
		              		width={size.width} height={size.height} 
		              		addedNewNode={selectedNodeObject.newNode}
		              		graphUpdateLabel={graphUpdateLabel}
		              		graphDataProvider={graphDataProvider}/>}
		              </div>
		              }
		        </SizeMe>
		    </div>
		    {showInfoComp &&
		    	<InfoBoxComponent/>
		    }
		    {!showInfoComp && isEditMode===false && 
		    	<ObjectClassModelViewMode 
		    		currentNodeJson={selectedNodeObject}
		    		classPropertyList={classPropertiesList} />}
	        {!showInfoComp &&
	        	<DetailsModelComponent
	        		updateChoices={updateChoices}
		        	objPropsRelatedToClass={objPropsRelatedToClass} 
		        	objectPropertyList={objectPropertyList} 
		        	removeElement={removeElement} 
		        	addNewProperty={addNewProperty} 
		        	classPropertyList={classPropertiesList} 
		        	currentNodeJson={selectedNodeObject} 
		        	updateValue={updateValue}/>	}   
	    </SplitPane>
	    <div className="tdb__model__footer"/>
	    </>
	)
}