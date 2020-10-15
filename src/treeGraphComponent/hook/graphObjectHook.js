import React, {useState,useEffect} from "react";
import MainGraphObject from "../MainGraphObject"

/*and(
     opt().triple("doc:test", "label", "v:label").delete_triple("doc:test", "label", "v:label"),
     add_triple("doc:test", "label", "New label")
)
 //appearance
   15  /*
   16: add_quad("MyClass", "subClassOf", "Parent", "schema/main")
   17: delete_quad("MyClass", "subClassOf", "Parent", "schema/main")
   18  
*/

export const graphObjectHook = (mainGraphDataProvider) => {

	const [graphDataProvider, setGraphDataProvider] = useState([]);
	const [selectedNodeObject, setSelectedNodeObject] = useState({});
	const [classPropertiesList, setClassPropertiesList] = useState([]);

	const [objectPropertyList, setObjectPropertyList] = useState([]);
	const [objPropsRelatedToClass,setObjPropsRelatedToClass]=useState([]);

	const [mainGraphObj, setMainGraphObj] = useState(null);

	const [graphUpdateLabel, setGraphUpdateLabel] = useState(null);

	const [classesListArr, setClassesListArr] = useState(null);
	const [entitiesListArr, setEntitiesListArr] = useState(null);
	const [availableParentsList, setAvailableParentsList] = useState({})
	//let mainGraphObj;

	/*
	* create the mainGraphObject and format the data
	*/
	useEffect(() => {

		if(mainGraphDataProvider){
			const mainGraphObject= new MainGraphObject(mainGraphDataProvider);

			setMainGraphObj(mainGraphObject)
			setGraphDataProvider(mainGraphObject.descendantsNode)
			setObjectPropertyList(mainGraphObject.getObjectPropertyMap())
			//setEntitiesListArr(mainGraphObject.classesListArr())
			//setClassesListArr(mainGraphObject.entitiesListArr())
		}

	}, [mainGraphDataProvider])

	

	const changeCurrentNode=(nodeId)=>{
		if(nodeId===null){
			setSelectedNodeObject(null)
			setClassPropertiesList([])
			setObjPropsRelatedToClass([])
		}else if(mainGraphObj && mainGraphObj.getElement(nodeId)){
			setSelectedNodeObject(mainGraphObj.getElement(nodeId));
			setClassPropertiesList(mainGraphObj.getPropertyListByDomain(nodeId));
			setObjPropsRelatedToClass(mainGraphObj.getObjPropsRelatedToClass(nodeId))
			setAvailableParentsList(mainGraphObj.getAvailableParentsList(nodeId))
		}
	}


	const setNodeAction=(actionName)=>{
		const nodeObject=mainGraphObj.nodeApplyAction(selectedNodeObject.name,actionName);
		setSelectedNodeObject(nodeObject)
	}

	const addNewProperty=(propertyType,propertyRange)=>{
		const propertiesList=mainGraphObj.addNewPropertyToClass(selectedNodeObject.name,propertyType,propertyRange);
		setClassPropertiesList(propertiesList)
	}

	const removeProperty=(propertyId)=>{
		const propertiesList=mainGraphObj.removePropertyToClass(selectedNodeObject.name,propertyId);
		setClassPropertiesList(propertiesList);
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

	const savedObjectToWOQL=()=>{
		return mainGraphObj.savedObjectToWOQL()
	}

	return {
        graphDataProvider,
        selectedNodeObject,
        classPropertiesList,
        graphUpdateLabel,
        changeCurrentNode,
        setNodeAction,
        updateValue,
        addNewProperty ,
        removeProperty,
        objectPropertyList,
        objPropsRelatedToClass,
        savedObjectToWOQL,
        updateParentsList,
        availableParentsList
        //entitiesListArr,
        //classesListArr
    }

}	

