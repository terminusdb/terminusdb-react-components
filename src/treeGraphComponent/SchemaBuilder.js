import React,{useState} from 'react';
import { SizeMe } from 'react-sizeme' 
import SplitPane from "react-split-pane";
import {ModelTreeComponent} from './ModelTreeComponent';
import {DetailsModelComponent} from './detailsComponent/DetailsModelComponent';
import {ADD_NEW_ENTITY,ADD_NEW_CLASS,ADD_PARENT,ADD_CHILD} from './node/NodeConstants';
import {graphObjectHook} from './hook/graphObjectHook';
import {TERMINUS_FONT_BASE} from '../constants/details-labels';
//import 'https://assets.terminusdb.com/terminusdb-console/fonts/icomoon-custom.css';

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
		  savedObjectToWOQL,
		  updateParentsList,availableParentsList
		  //entitiesListArr,classesListArr
		  } = graphObjectHook(props.mainGraphDataProvider);


	const saveData=()=>{
		const query = savedObjectToWOQL();
		if(props.saveGraph)props.saveGraph(query)
	}
	
	const panelIsOpen=props.panelIsOpen || true;

	const mainPanelSize=panelIsOpen ? "calc(100% - 450px)" : "100%";
	const treeMainGraphObj=props.treeMainGraphObj;

	return (
		<>
		<button onClick={saveData} >Save Data</button>
		<SplitPane className="colWindow" split="vertical" minSize={400} size={mainPanelSize}>							   							
			<div>
				<SizeMe monitorHeight={true}>{({ size }) =>
		            <div style={{ minHeight:"400px", height: "calc(100vh - 10px)"}}>
		              {graphDataProvider && 
		              	<ModelTreeComponent 
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
	        <DetailsModelComponent
	        	//classesListArr={classesListArr}
	        	//entitiesListArr={entitiesListArr}
	        	availableParentsList={availableParentsList}
	        	updateParentsList={updateParentsList}
	        	objPropsRelatedToClass={objPropsRelatedToClass} 
	        	objectPropertyList={objectPropertyList} 
	        	removeElement={removeElement} 
	        	addNewProperty={addNewProperty} 
	        	classPropertyList={classPropertiesList} 
	        	currentNodeJson={selectedNodeObject} 
	        	updateValue={updateValue}/>	    
	    </SplitPane>
	    </>
	)
}