import * as NODE_ACTION_NAME from './utils/actionType';
import {removeElementToArr} from './utils/modelTreeUtils'

import {formatData,
		formatProperties,
		formatDataForTreeChart,
		checkInheritance,
		OrdinaryClassObj,
		EntityClassObj,
		availableParentsList,addObjectPropertyRangeItem,
		addElementToPropertyList} from './FormatDataForTree';

import {graphUpdateObject} from './utils/graphUpdateObject';
import {CLASS_TYPE_NAME} from './utils/elementsName' 

export const MainGraphObject = (mainGraphDataProvider,dbName)=>{

	let _objectTypeList=[];

	let _documentTypeList=[];

	let _objectChoiceList =[]

    /*
    * the list of all the property
    */
	let _propertiesList=new Map();
	
	/*
	* properties organized by domain
	* {domaidName:[{propertyObj001},{propertyObj002}]}
	*/
	let _domainToProperties={};

	/*
	* the list of all the class for the link properties
	*/
	let _objectPropertyList=[];

	/*
	* Link Properties/Enum Property organized by range
	* {rangeidName:[{propertyObj001},{propertyObj002}]}
	*/
	let _objectPropertyToRange={};

	/*
	* all the node elements
	*/
	let _rootIndexObj={}

	let _descendantsNode=new Map();

	let _mainGraphElementsJson={};

	/*
	* this object registers all the graph changes 
	*/
	let _graphUpdateObject= new graphUpdateObject();


	const getElementsNumber=()=>{
		return {properties:_propertiesList.size,
		        entities:_documentTypeList.length,
		        classes:_objectTypeList.length,
		    	choiceClasses:_objectChoiceList.length}
	}

	const getObjectProperties=()=>{
		return _objectPropertyList;
	}

	const getObjectChoices=()=>{
		return _objectChoiceList;
	}

	const getRoot=(type=null)=>{
		switch(type){
			case CLASS_TYPE_NAME.OBJECT_CLASS:
			case CLASS_TYPE_NAME.OBJECT_CLASSES:
				return _rootIndexObj[CLASS_TYPE_NAME.OBJECT_CLASSES]
			case CLASS_TYPE_NAME.DOCUMENT_CLASS:
			case CLASS_TYPE_NAME.DOCUMENT_CLASSES:
				return _rootIndexObj[CLASS_TYPE_NAME.DOCUMENT_CLASSES]
			case CLASS_TYPE_NAME.CHOICE_CLASS:
			case CLASS_TYPE_NAME.CHOICE_CLASSES:
				return _rootIndexObj[CLASS_TYPE_NAME.CHOICE_CLASSES];
			default:
			 	return _rootIndexObj.ROOT;
		}		
	}

	const uniqueName=(newID)=>{

	}

	const objectPropertyToRange=()=>{
		return _objectPropertyToRange;
	}

	const getObjPropsRelatedToClass=(nodeId)=>{
		if(_objectPropertyToRange[nodeId]){
			return _objectPropertyToRange[nodeId]
		}
		return []
	}

	const getDescendantsNode=()=>{
		return _descendantsNode;
	}

	/*
	* maybe I have to get it from _descendantsNode
	*/
	const getElement=(key)=>{
		if(_rootIndexObj && _rootIndexObj[key]){
			return _rootIndexObj[key];
		}
		return undefined;
	}

	
	const createNewMainGraph=()=>{
		_mainGraphElementsJson=mainGraphDataProvider;
		_rootIndexObj=formatData(mainGraphDataProvider.classesResult,dbName);		
		const[propertyByDomain,objectPropertyRange,propertiesList]=formatProperties(mainGraphDataProvider.propsResult,mainGraphDataProvider.restResult,_rootIndexObj);		
		_domainToProperties=propertyByDomain;
		_objectPropertyToRange=objectPropertyRange;
		_propertiesList=propertiesList;
		formatDataForTree()
	}

	createNewMainGraph();
	
	const getAvailableParentsList=(nodeId)=>{
		const nodeObject=getElement(nodeId);
		return  availableParentsList(nodeObject,_objectTypeList,_documentTypeList,_rootIndexObj)
	}

	const addNewPropertyToClass=(nodeName, propertyType, propertyRange)=>{
		if(nodeName!==null && _rootIndexObj[nodeName]){ 
			const newProperty=_graphUpdateObject.addPropertyToClass(nodeName,propertyType,propertyRange);
			if(!_domainToProperties[nodeName]){
				_domainToProperties[nodeName]=[];
			}
			_domainToProperties[nodeName].unshift(newProperty);
			_propertiesList.set(newProperty.name,newProperty);
			return  _domainToProperties[nodeName].slice();
		}
		return [];
	}


	const nodeApplyAction=(actionName,nodeName)=>{
		if(nodeName!==null && _rootIndexObj[nodeName]){ 
            let currentNode=_rootIndexObj[nodeName];
            let elementType=currentNode.type;
            let actionType=actionName;         
   			let isChoiceClass= false;

            switch (actionName){
              case NODE_ACTION_NAME.ADD_NEW_ENTITY:
                   elementType=CLASS_TYPE_NAME.DOCUMENT_CLASS;
                   nodeName=CLASS_TYPE_NAME.DOCUMENT_CLASSES;
                   /*
                   * I get as currentNode the DocumentClasses node 
                   */
                   currentNode=getRoot(nodeName);
                   
                   actionType=NODE_ACTION_NAME.ADD_CHILD;
                   
                   break;
              case NODE_ACTION_NAME.ADD_NEW_CLASS:
                   elementType=CLASS_TYPE_NAME.OBJECT_CLASS
                   nodeName=CLASS_TYPE_NAME.OBJECT_CLASSES
                   currentNode=getRoot(elementType);
                   actionType=NODE_ACTION_NAME.ADD_CHILD;                 
                   break;

              case  NODE_ACTION_NAME.ADD_NEW_CHOICE_CLASS:
              		elementType=CLASS_TYPE_NAME.CHOICE_CLASS
                    nodeName=CLASS_TYPE_NAME.CHOICE_CLASSES
                    currentNode=getRoot(elementType)
                    actionType=NODE_ACTION_NAME.ADD_CHILD
              		isChoiceClass=true
              		break
            }
        	 let newNodeObj={};
        	 if(actionName===NODE_ACTION_NAME.ADD_PARENT){

        	 	/*
        	 	*I have two case current node child of one Group Node
        	 	*NEW PARENT IS CHILD OF Group Node and has as child the currentNode
        	 	*/
        	 	const rootParentNode=getRoot(elementType);

        	 	newNodeObj=_graphUpdateObject.addNodeToTree(rootParentNode,currentNode);
        		

        	 	rootParentNode.children.push(newNodeObj);

        	 	newNodeObj.children.push(currentNode);
        	 	newNodeObj.allChildren.push(currentNode);  


        	 	/*
    	 		* check if I have to remove the child from the root node
    	 		*/
        	 	removeChildFromRoot(currentNode)
        	 	
        	 	nodeName=rootParentNode.name;
        	 }else{

        	 	newNodeObj=_graphUpdateObject.addNodeToTree(currentNode,null,isChoiceClass);

        	 	if(currentNode.type==="Group"){
        	 		currentNode.children.push(newNodeObj);
	        	}else {
	        		/*
	        		* currentNode is the parent node
	        	 	*/
	        	 	currentNode.children.push(newNodeObj);
	        	 	currentNode.allChildren.push(newNodeObj);
	        	}
        	 }
        	 _rootIndexObj[newNodeObj.name]=newNodeObj;

        	 /*
        	 * to be review...
        	 */
        	 addNodeToclassList(newNodeObj);
        	 
        	 setNewElementPosition(nodeName,newNodeObj);
        	 return newNodeObj;
         }
	}

	const addNodeToclassList=(elementObj)=>{
		switch(elementObj.type){
			case CLASS_TYPE_NAME.DOCUMENT_CLASS:
				_documentTypeList.push(elementObj.name)
				addElementToPropertyList(elementObj,_objectPropertyList);
				break;
			case CLASS_TYPE_NAME.OBJECT_CLASS:
				_objectTypeList.push(elementObj.name)
				addElementToPropertyList(elementObj,_objectPropertyList);
				break;
			case CLASS_TYPE_NAME.CHOICE_CLASS:
				addElementToPropertyList(elementObj,_objectChoiceList);
				break;
				//_classesList.set(elementObj.name,{value:node.data.name,name:node.data.name,label:node.data.label});
		}
	}
	
	/*
    *I have to check if the new parent and the node have the same parents.....
    *in this case I have to remove the direct parent
    */
    const checkRelatedParents=(elementObjClass,parentObjClass)=>{
    	parentObjClass.parents.forEach((parentName)=>{
    		const parentOfParentObj=_rootIndexObj[parentName];
    		const parentRelated=removeElementToArr(elementObjClass.parents,parentName);    		
	    	if(parentRelated){
	    		
	    		/*
	    		* remove child from parent
	    		*/
	    		removeElementToArr(parentOfParentObj.children,elementObjClass.name)
	    		if(parentOfParentObj.allChildren){
	    			removeElementToArr(parentOfParentObj.children,elementObjClass.name)
	    		}
				/*
				* register to be save to schema
				*/
				_graphUpdateObject.changeNodeParent(elementObjClass.name,parentName,NODE_ACTION_NAME.REMOVE_PARENT)
	    	}
	    	checkRelatedParents(elementObjClass,parentOfParentObj)
	    })
	}


	const updateNodeParents=(elementName,parentName,actionName)=>{
	   const elementObjClass=_rootIndexObj[elementName];
	   const parentObjClass=_rootIndexObj[parentName];
	   
	   checkRelatedParents(elementObjClass,parentObjClass);

	   _graphUpdateObject.changeNodeParent(elementName,parentName,actionName);

	   if(actionName===NODE_ACTION_NAME.ADD_PARENT){
			//the node could be children of another node or children of root node 
			if(parentObjClass.type===elementObjClass.type){
				  removeChildFromRoot(elementObjClass);
				  if(elementObjClass.parents.length===0){
					parentObjClass.children.push(elementObjClass);
				  }
			}			
			elementObjClass.parents.push(parentObjClass.name);
			parentObjClass.allChildren.push(elementObjClass);

		}else{
			removeElementToArr(elementObjClass.parents,parentName);
			removeElementToArr(parentObjClass.children,elementName);
			if(parentObjClass.allChildren)
				removeElementToArr(parentObjClass.allChildren,elementName);

			/*
			* if the parents array is empty I move the node under the root group
			*/
			if(elementObjClass.parents.length===0){
				parentName=addToParentGroup(elementObjClass)
			}else if(elementObjClass.type===CLASS_TYPE_NAME.DOCUMENT_CLASS){
				const docParent=elementObjClass.parents.findIndex((pName)=>{
							const pElement=_rootIndexObj[pName];

							return pElement.type===CLASS_TYPE_NAME.DOCUMENT_CLASS
						})
				if(docParent===-1){
					parentName=addToParentGroup(elementObjClass)
				}
			}
		}
		/*
		* this is for save the change
		*/
		moveNodeUnderParent(parentName,elementName);
		return elementObjClass;
	}

	const addToParentGroup=(elementObjClass)=>{
		const parentRoot=getRoot(elementObjClass.type);
		parentRoot.children.push(elementObjClass);
		if(elementObjClass.type==='Document'){
			_graphUpdateObject.changeNodeParent(elementObjClass.name,'Document',NODE_ACTION_NAME.ADD_PARENT);
		}
		return parentRoot.name;
	}

	const _removeClassElement=(elementName)=>{
		const classElement=_rootIndexObj[elementName];
		if(classElement){
			/*
			*register the remove 

			*/		
			/*
			* if this is an UNDO action (ex UNDO of add Parent)
			* I could remove a node with a child
			* so I have to move the child node under 
			* a new parent before delete it 
			*/
			/*	if(classElement._childrenObj.size>0){
				for (let childObj of classElement._childrenObj.values()){
					updateNodeParents(childObj.id,elementName,NODE_ACTION_NAME.REMOVE_PARENT)
				}
			}*/

			
			// I have to remove the node from the nodeParents list
			
			classElement.parents.forEach((parentName)=>{
				const parentObj=_rootIndexObj[parentName];
				removeElementToArr(parentObj.children,elementName)
				if(parentObj.allChildren)
					removeElementToArr(parentObj.allChildren,elementName)
			})

			/*
			* I have to remove from the itemlists
			*/
			delete _rootIndexObj[elementName];
			const nodeElement=_descendantsNode.get(elementName);			
			_descendantsNode.delete(elementName);
			
			switch(classElement.type){
				case CLASS_TYPE_NAME.OBJECT_CLASS:
					removeElementToArr(_objectTypeList,elementName)
					removeElementToArr(_objectPropertyList,elementName) //_classesList.delete(elementName);
					break;
			    case CLASS_TYPE_NAME.DOCUMENT_CLASS:
			    	removeElementToArr(_documentTypeList,elementName)
			    	removeElementToArr(_objectPropertyList,elementName)
			    	break;
			    case CLASS_TYPE_NAME.CHOICE_CLASS:
			    	removeElementToArr(_objectChoiceList,elementName)
			}

			_graphUpdateObject.removeNode(classElement)

			// I need the node element for UNDO action
			//return nodeElement;
		}
	}

	/*
	* I can remove a node if it hasn't
	* children and it is not a target in a relationship 
	* (this node can not be a range in a property link)
	*/
	const removeElementInMainGraph=(elementName)=>{
		const listOfProperty=_domainToProperties[elementName] ? _domainToProperties[elementName].slice() : [];
		if(listOfProperty.length>0){
			listOfProperty.forEach((property,key)=>{
				removePropertyToClass(elementName,property.name);
			})
			
		}
		return _removeClassElement(elementName);
	}


	const removePropertyToClass=(domainClassName,propertyName)=>{
		const propertyObject=_propertiesList.get(propertyName);

		const propertyByDomain=_domainToProperties[domainClassName] || [];	
		
		//remove by domain
		removeElementToArr(propertyByDomain,propertyName)
		
		// remove by range
		const propertyByRange=_objectPropertyToRange[propertyObject.range];
		removeElementToArr(propertyByRange,propertyName);
		
		//remove from property list
		_propertiesList.delete(propertyName);

		_graphUpdateObject.removePropertyToClass(propertyObject);

		return propertyByDomain.slice();
	}

	/*
      *if I remove a parent 
      *I have to remove child from parent too(children Obj)  
      */
    const removeChildFromRoot=(currentNode)=>{
      	const rootNode=getRoot(currentNode.type);
      	if(!rootNode.children || rootNode.children.length===0)return;
      	removeElementToArr(rootNode.children,currentNode.name);
    }
    

    const moveNodeUnderParent=(parentId,nodeId)=>{
    	let parentNode=_descendantsNode.get(parentId);
    	let elementNode=_descendantsNode.get(nodeId);
        elementNode.parent=parentNode
        elementNode.depth=parentNode.depth+1;
        elementNode.x=parentNode.x+100;
        elementNode.y=parentNode.y+100;
    }

	const setNewElementPosition=(parentId,newNodeObj,asType)=>{
		let parentNode=_descendantsNode.get(parentId);
        let yStep=parentNode.y+100;
        let xStep=parentNode.x+100;
        let newNode={}
        newNode.parent=parentNode
        newNode.depth=parentNode.depth+1;
        newNode.x=xStep;
        newNode.y=yStep;
        newNode.data=newNodeObj;
        _descendantsNode.set(newNodeObj.name,newNode);
	}

	const getPropertyListByDomain=(domainClassName)=>{
		if(_domainToProperties[domainClassName]) return _domainToProperties[domainClassName];
		return []
	}

	const getProperty=(propertyName)=>{
		return _propertiesList.get(propertyName);
	}

	const getPropertyDomain=(property)=>{
		return property.domain && property.domain.length>0 ? property.domain[0] : undefined;
	}


	function formatDataForTree(){
		const [descendantsNode, 
			  objectTypeList,
			  documentTypeList,
			  objectPropertyList,
			  objectChoiceList] = new formatDataForTreeChart(getRoot());
		_descendantsNode=descendantsNode;
		//_classesList=classesList;
		//_entitiesList=entitiesList;
		_documentTypeList=documentTypeList
		_objectTypeList=objectTypeList
		_objectPropertyList=objectPropertyList;
		_objectChoiceList=objectChoiceList;
	}

	const descendantsNodeAsArray=()=>{
		return [..._descendantsNode.values()]
	}

	const savedObjectToWOQL=()=>{
		return _graphUpdateObject.savedObjectToWOQL(_rootIndexObj,_propertiesList);
	}

	const updateChoices=(elementName,choicesList)=>{
		const choiceClass=_rootIndexObj[elementName];
		choiceClass['choices']=choicesList;

		_graphUpdateObject.updateChoicesList(choiceClass)
	}

	const updateObjectPropertyListLabel=(objectPropList,elementDataObject)=>{

		const index=objectPropList.findIndex(function(item){
			if(item.name===elementDataObject.name){
				item.label=elementDataObject.label || elementDataObject.id;
			}
			return item.name===elementDataObject.name
			})
      	
	}

	const changeElementDataValue=(propName,propValue,elementDataObject)=>{
		/*
		* put the data in the list to save
		*/
		_graphUpdateObject.updateTripleElement(propName,propValue,elementDataObject);
		
		let objectPropList=_objectPropertyList;

		switch(elementDataObject.type){
			case CLASS_TYPE_NAME.CHOICE_CLASS:	
				 objectPropList=_objectChoiceList;
			case CLASS_TYPE_NAME.DOCUMENT_CLASS:				 
			case CLASS_TYPE_NAME.OBJECT_CLASS:								
				const currentNode=_rootIndexObj[elementDataObject.name];
				currentNode[propName]=propValue;
				if(propName==='label'){
					updateObjectPropertyListLabel(objectPropList,elementDataObject)
				}
				break;
			//property case
			default:
			//objectPropertyRangeItem

				const currentProperty=_propertiesList.get(elementDataObject.name);
				const propRange=currentProperty.range;
				currentProperty[propName]=propValue;

				if(propName==='range' && _rootIndexObj[propValue]!==undefined){
					const classElement=_rootIndexObj[propValue]
					addObjectPropertyRangeItem(_objectPropertyToRange,currentProperty,classElement,propRange)
				}
			
		}
	}

	const getObjectTypeList=()=>{
		return _objectTypeList;
	}

	const getDocumentTypeList=()=>{
		return _documentTypeList;
	}

	 

	return {objectPropertyToRange,
			updateChoices,
			getObjectChoices,
			getObjectTypeList,
			getDocumentTypeList,
			getElementsNumber,getElement,getPropertyListByDomain,getObjPropsRelatedToClass,getAvailableParentsList,
      nodeApplyAction,addNewPropertyToClass,removePropertyToClass,changeElementDataValue,
      updateNodeParents,savedObjectToWOQL,getObjectProperties,getDescendantsNode,removeElementInMainGraph}
}
