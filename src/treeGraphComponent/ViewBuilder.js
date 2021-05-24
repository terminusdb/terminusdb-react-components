import React,{useState,useEffect} from 'react';
import { SizeMe } from 'react-sizeme'
import SplitPane from "react-split-pane";
import {CLASS_TYPE_NAME} from "./utils/elementsName";
import {ModelTreeComponent} from './ModelTreeComponent';
import {DetailsModelComponent} from './detailsComponent/DetailsModelComponent';
import {ADD_NEW_ENTITY,ADD_NEW_CLASS,ADD_PARENT,ADD_CHILD} from './node/NodeConstants';
import {GraphContextObj} from './hook/graphObjectContext';
import {TERMINUS_FONT_BASE, DEFAULT_SCHEMA_VIEW} from '../constants/details-labels';
import {ModelMainHeaderComponent} from './detailsComponent/ModelMainHeaderComponent';
import {InfoBoxComponent} from './detailsComponent/InfoBoxComponent'
import {ObjectClassModelViewMode} from './detailsComponent/viewMode/ObjectClassModelViewMode'
import {InfoObjectComponent} from './detailsComponent/InfoObjectComponent'
import {BsChevronRight, BsChevronLeft} from "react-icons/bs"

export const ViewBuilder = (props)=>{

	const {graphDataProvider,
		  setNodeAction,
		  graphUpdateLabel,
		  selectedNodeObject,
		  changeCurrentNode,
		  nodePropertiesList,
		  objectPropertyToRange,
		  updateValue,
		  addNewProperty,
		  removeElement,
		  objectPropertyList,
		  objPropsRelatedToClass,
		  savedObjectToWOQL,updateChoices,isFocusOnNode
		  } = GraphContextObj();

	const [isEditMode,setIsEditMode]=useState(false)
	const [panelIsOpen,setOpenClosePanel]=useState(true)
	const [zoomEvent,setZoomEvent]=useState(undefined)
	const [view, setView]=useState(DEFAULT_SCHEMA_VIEW)

	useEffect(() => {
		if(!props.view) setView(DEFAULT_SCHEMA_VIEW)
		else setView(props.view)
	}, [props.view])

	const saveData=(commitMessage)=>{
		const query = savedObjectToWOQL();
		if(props.saveGraph) props.saveGraph(query, commitMessage)
	}

	const [width, setWidth] = useState("")

	const handleWidthChange = (sz, setWidth) => {
	    const maxWidth = 1000;
	    const padding = 225;
	    const paneWidth = maxWidth - sz - padding;
	    setWidth({ width: paneWidth + "px" });
	}

	/*
	* Edit mode when model is empty, so it has only the group type
	*/
	useEffect(() => {
         //startDataProsition();
        if(graphDataProvider && graphDataProvider.size===4){
			setIsEditMode(true);
		}//else{
			//setIsEditMode(false);
		//}
    }, [graphDataProvider])

	//const panelIsOpen=props.panelIsOpen || true;

	const mainPanelSize=panelIsOpen ? "calc(100% - 450px)" : "100%";

	const treeMainGraphObj=props.treeMainGraphObj;

	let showInfoComp=false
	if(!selectedNodeObject || !selectedNodeObject.name ||
		selectedNodeObject.type===CLASS_TYPE_NAME.SCHEMA_ROOT ||
		selectedNodeObject.type===CLASS_TYPE_NAME.SCHEMA_GROUP){
		showInfoComp=true;
	}


	return (

		<div style={{display: "contents"}}>
			<SplitPane split="vertical"
				defaultSize="70%"
				onChange={size => handleWidthChange(size, setWidth)}>

				<SizeMe monitorHeight={true}>{({ size }) =>
		            <div style={{ minHeight:"400px", height: "calc(100vh - 10px)", width: "100%"}}>
		                {graphDataProvider && <>
							<ModelTreeComponent
			              		objectPropertyToRange={objectPropertyToRange}
			              		zoomEvent={zoomEvent}
			              		isEditMode={isEditMode}
			              		setNodeAction={setNodeAction}
			              		selectedNodeObject={selectedNodeObject}
			              		changeCurrentNode={changeCurrentNode}
			              		width={size.width} height={size.height}
			              		addedNewNode={selectedNodeObject.newNode}
			              		graphUpdateLabel={graphUpdateLabel}
			              		graphDataProvider={graphDataProvider}
			              		isFocusOnNode={isFocusOnNode}/>
						</>}
		              </div>
		              }
		        </SizeMe>
				<div>
					<ModelMainHeaderComponent
						panelIsOpen={panelIsOpen}
						openClosePanel={setOpenClosePanel}
						setNodeAction={setNodeAction}
						extraTools={props.extraTools}
						setZoomEvent={setZoomEvent}
						saveData={saveData}
						view={view}
						changeMode={setIsEditMode}
						isEditMode={isEditMode}
						custom={props.custom}/>
				    {showInfoComp && selectedNodeObject.type!==CLASS_TYPE_NAME.SCHEMA_GROUP &&
				    	<InfoBoxComponent dbName={props.dbName} custom={props.custom}/>
				    }
				    {showInfoComp && selectedNodeObject.type===CLASS_TYPE_NAME.SCHEMA_GROUP &&
				    	<InfoObjectComponent panelType={selectedNodeObject.name} custom={props.custom}/>
				    }
				    {/* commenting out object views temporarily
						!showInfoComp && props.isEditMode===false &&
				    	<ObjectClassModelViewMode custom={props.custom}/>*/}
			        {!showInfoComp &&
			        	<DetailsModelComponent
			        		updateChoices={updateChoices}
				        	objPropsRelatedToClass={objPropsRelatedToClass}
				        	objectPropertyList={objectPropertyList}
				        	removeElement={removeElement}
				        	addNewProperty={addNewProperty}
				        	nodePropertiesList={nodePropertiesList}
				        	currentNodeJson={selectedNodeObject}
				        	updateValue={updateValue}
							custom={props.custom}/>	}


				</div>
		    </SplitPane>

	    </div>
	)
}
