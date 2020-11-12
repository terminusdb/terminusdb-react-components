import React, {useState,useEffect,useContext} from "react";
import {MainGraphObject} from "../MainGraphObject"

export const GraphContext = React.createContext()
export const GraphContextObj = () => useContext(GraphContext)

export const GraphObjectProvider = ({mainGraphDataProvider,children}) => {

	const [graphDataProvider, setGraphDataProvider] = useState([]);
	const [selectedNodeObject, setSelectedNodeObject] = useState({});
	const [classPropertiesList, setClassPropertiesList] = useState([]);

	const [isFocusOnNode, setFocusOnNode] = useState(false);


	const [objectChoicesList, setObjectChoicesList] = useState([]);
	const [objectPropertyList, setObjectPropertyList] = useState([]);
	const [objPropsRelatedToClass,setObjPropsRelatedToClass]=useState([]);

	const [mainGraphObj, setMainGraphObj] = useState(null);

	const [graphUpdateLabel, setGraphUpdateLabel] = useState(null);

	const [classesListArr, setClassesListArr] = useState(null);
	const [entitiesListArr, setEntitiesListArr] = useState(null);
	const [availableParentsList, setAvailableParentsList] = useState({})
	const [elementsNumber, setElementNumbers] = useState({})

	const [needToSave, setNeedToSave] = useState(false)
	//let mainGraphObj;

	/*
	* create the mainGraphObject and format the data
	*/
	useEffect(() => {

		if(mainGraphDataProvider){
			const mainGraphObject= new MainGraphObject(mainGraphDataProvider);

			setMainGraphObj(mainGraphObject)
			setGraphDataProvider(mainGraphObject.getDescendantsNode())
			setObjectPropertyList(mainGraphObject.getObjectProperties())
			setObjectChoicesList(mainGraphObject.getObjectChoices())
			resetSelection()
			/*
			to be review
			*/
			setElementNumbers(mainGraphObject.getElementsNumber())
		}

	}, [mainGraphDataProvider])

	const resetSelection=()=>{
		setSelectedNodeObject({})
		setClassPropertiesList([])
		setObjPropsRelatedToClass([])
		setAvailableParentsList({})
	}

	const changeCurrentNode=(nodeId,focusOnNode=false)=>{
		setFocusOnNode(focusOnNode);
		if(nodeId===null){
			setSelectedNodeObject({})
			setClassPropertiesList([])
			setObjPropsRelatedToClass([])
		}else if(mainGraphObj && mainGraphObj.getElement(nodeId)){
			setSelectedNodeObject(mainGraphObj.getElement(nodeId));
			setClassPropertiesList(mainGraphObj.getPropertyListByDomain(nodeId));
			setObjPropsRelatedToClass(mainGraphObj.getObjPropsRelatedToClass(nodeId))
			setAvailableParentsList(mainGraphObj.getAvailableParentsList(nodeId))
		}
	}

	const setNodeAction=(actionName,nodeName=null,focusOnNode=false)=>{
		const node_name=nodeName || selectedNodeObject.name;
		const nodeObject=mainGraphObj.nodeApplyAction(actionName,node_name);
		changeCurrentNode(nodeObject.name,focusOnNode);
	}

	const addNewProperty=(propertyType,propertyRange)=>{
		const propertiesList=mainGraphObj.addNewPropertyToClass(selectedNodeObject.name,propertyType,propertyRange);
		setClassPropertiesList(propertiesList)
	}
	
	const removeElement=(elementId,elementType)=>{
		switch(elementType){
			case 'Document':
			case 'Class':
				mainGraphObj.removeElementInMainGraph(selectedNodeObject.name);
				resetSelection()
				break;
			default:
				const propertiesList=mainGraphObj.removePropertyToClass(selectedNodeObject.name,elementId);
				setClassPropertiesList(propertiesList);
		}
		
	}

	const updateValue = (propName,propValue,elementDataObject)=>{
		mainGraphObj.changeElementDataValue(propName,propValue,elementDataObject)
		if(propName==='label' && elementDataObject.type!=='Property'){
			setGraphUpdateLabel(Date.now())
		}
	}

	const updateParentsList =(parentName,action)=>{
		mainGraphObj.updateNodeParents(selectedNodeObject.name,parentName,action)
		setAvailableParentsList(mainGraphObj.getAvailableParentsList(selectedNodeObject.name))
		setGraphUpdateLabel(Date.now());
	}

	const updateChoices =(choicesList)=>{
		mainGraphObj.updateChoices(selectedNodeObject.name,choicesList)	
	}

	const savedObjectToWOQL=()=>{
		return mainGraphObj.savedObjectToWOQL()
	}

	return (
		<GraphContext.Provider
            value={{
	        graphDataProvider,
	        selectedNodeObject,
	        classPropertiesList,
	        graphUpdateLabel,
	        changeCurrentNode,
	        setNodeAction,
	        updateValue,
	        addNewProperty,
	        removeElement,
	        objectPropertyList,
	        objPropsRelatedToClass,
	        savedObjectToWOQL,
	        updateParentsList,
	        availableParentsList,
	        elementsNumber,
	        mainGraphObj,
	        objectChoicesList,
	        updateChoices,
	        isFocusOnNode,
	        needToSave
	    	}}>
	     {children}
        </GraphContext.Provider>

        //entitiesListArr,
        //classesListArr
    )
}	

