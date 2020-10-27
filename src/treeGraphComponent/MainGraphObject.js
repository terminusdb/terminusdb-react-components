import * as NODE_ACTION_NAME from './utils/actionType';
import {formatData,
		formatProperties,
		formatDataForTreeChart,
		checkInheritance,
		OrdinaryClassObj,
		EntityClassObj,
		availableParentsList} from './FormatDataForTree';

import {graphUpdateObject} from './utils/graphUpdateObject'

export const MainGraphObject = (mainGraphDataProvider)=>{

	let _classesList=new Map();

	let _entitiesList=new Map();

	let _objectChoiceList =[]

    /*
    * all the propertyList ????
    */
	let _propertiesList=new Map();
	/*
	* the list of link properties
	*/
	let _objectPropertyList=[];

	let _domainToProperties={};

	let _objectPropertyToRange={};

	let _rootIndexObj={}

	let _descendantsNode=new Map();

	let _mainGraphElementsJson={};

	/*
	* this object registers all the graph changes 
	*/
	let _graphUpdateObject= new graphUpdateObject();


	const getElementsNumber=()=>{
		return {properties:_propertiesList.size,
		        entities:_entitiesList.size,
		        classes:_classesList.size}
	}

	const getObjectProperties=()=>{
		return _objectPropertyList;
	}

	const getObjectChoices=()=>{
		return _objectChoiceList;
	}

	const getRoot=(type=null)=>{
		switch(type){
			case 'Class':
			case 'OrdinaryClasses':
				return _rootIndexObj.OrdinaryClasses;
			case 'Document':
			case 'DocumentClasses':
				return _rootIndexObj.DocumentClasses;
			default:
			 	return _rootIndexObj.ROOT;
		}		
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

	/*
	{classResult:{},
	  propsResult:{},
	  restResult:{}})
	*/
	const createNewMainGraph=(mainGraphDataProvider)=>{
		_mainGraphElementsJson=mainGraphDataProvider;
		_rootIndexObj=formatData(mainGraphDataProvider.classesResult);		
		const[propertyByDomain,objectPropertyRange,propertiesList]=formatProperties(mainGraphDataProvider.propsResult,mainGraphDataProvider.restResult,_rootIndexObj);		
		_domainToProperties=propertyByDomain;
		_objectPropertyToRange=objectPropertyRange;
		_propertiesList=propertiesList;
		formatDataForTree()
	}

	createNewMainGraph(mainGraphDataProvider);
	
	const getAvailableParentsList=(nodeId)=>{
		const nodeObject=getElement(nodeId);
		return  availableParentsList(nodeObject,_classesList,_entitiesList,_rootIndexObj)
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


	const nodeApplyAction=(nodeName,actionName)=>{
		if(nodeName!==null && _rootIndexObj[nodeName]){ 
            let currentNode=_rootIndexObj[nodeName];
            let elementType=currentNode.type;
            let actionType=actionName;         
   			let isChoiceClass= false;

            switch (actionName){
              case NODE_ACTION_NAME.ADD_NEW_ENTITY:
                   elementType='DocumentClasses';
                   nodeName='DocumentClasses';
                   /*
                   * I get as currentNode the DocumentClasses node 
                   */
                   currentNode=getRoot(nodeName);
                   
                   actionType=NODE_ACTION_NAME.ADD_CHILD;
                   
                   break;
              case NODE_ACTION_NAME.ADD_NEW_CLASS:
                   elementType='OrdinaryClasses';
                   nodeName='OrdinaryClasses'
                   currentNode=getRoot(elementType);
                   actionType=NODE_ACTION_NAME.ADD_CHILD;
                   
                   break;

              case  NODE_ACTION_NAME.ADD_NEW_CHOICE_CLASS:
              		elementType='OrdinaryClasses';
                    //nodeName='OrdinaryClasses'
                    currentNode=getRoot(elementType);
                    actionType=NODE_ACTION_NAME.ADD_CHILD;
              		isChoiceClass=true;
              		break;
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

        	 	if(currentNode.parents.length===0){
        	 		removeChildFromRoot(currentNode)
        	 	}
        	 	//currentNode.parents.push[newNodeObj];

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
	        	 	/*
	        	 	* update constraint for the node
	        	 	*/
	        	 	currentNode.hasConstraints=true;

	        	 	//newNodeObj.parents.push({label:currentNode.label,name:currentNode.name});

	        	 	//checkInheritance(currentNode,newNodeObj)
	        	}
        	 }
        	 _rootIndexObj[newNodeObj.name]=newNodeObj;
        	 setNewElementPosition(nodeName,newNodeObj);
        	 return newNodeObj;
         }
	}
	
	/*
    *I have to check if the new parent and the node have the same parents.....
    *in this case I have to remove the direct parent
    */
    const checkRelatedParents=(elementObjClass,parentObjClass)=>{
    	parentObjClass.parents.forEach((parent)=>{
    		const parentOfParentObj=_rootIndexObj[parent.name];
    		const parentRelated=removeElementToArr(elementObjClass.parents,parent.name);    		
	    	if(parentRelated){
	    		
	    		/*
	    		* remove child from parent
	    		*/
	    		removeElementToArr(parentOfParentObj.children,elementObjClass.name)
				/*
				* register to be save to schema
				*/
				_graphUpdateObject.changeNodeParent(elementObjClass.name,parent.name,NODE_ACTION_NAME.REMOVE_PARENT)
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
	   	    if(elementObjClass.parents.length===0 && 
	   	       parentObjClass.type===elementObjClass.type){
	   	    	removeChildFromRoot(elementObjClass);
	   	    }
	   	    //{label:label,name:classId,type:_rootIndexObj[classId].type}
			elementObjClass.parents.push({label:parentObjClass.label,name:parentObjClass.name,type:parentObjClass.type})//(parentName,parentObjClass);
			parentObjClass.children.push(elementObjClass);

		}else{
			removeElementToArr(elementObjClass.parents,parentName);
			removeElementToArr(parentObjClass.children,elementName);

			/*
			* if the parents array is empty I move the node under the root group
			*/
			if(elementObjClass.parents.length===0){
				const parentRoot=getRoot(elementObjClass.type);
				parentRoot.children.push(elementObjClass);
				parentName=parentRoot.name;
				if(elementObjClass.type==='Document'){
					_graphUpdateObject.changeNodeParent(elementName,'Document',NODE_ACTION_NAME.ADD_PARENT);
				}				
			}
		}
		/*
		* this is for save the change
		*/
		moveNodeUnderParent(parentName,elementName);
		return elementObjClass;
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
			
			classElement.parents.forEach((parent)=>{
				const parentObj=_rootIndexObj[parent.name];
				removeElementToArr(parentObj.children,elementName)
			})

			/*
			* I have to remove from the itemlists
			*/
			delete _rootIndexObj[elementName];
			const nodeElement=_descendantsNode.get(elementName);			
			_descendantsNode.delete(elementName);
			
			switch(classElement.type){
				case 'Class':
					 _classesList.delete(elementName);
					 break;
			    case 'Document':
			         _entitiesList.delete(elementName);
			}

			_graphUpdateObject.removeNode(classElement)

			// I need the node element for UNDO action
			//return nodeElement;
		}
	}

	/*
	*I can remove a node if it hasn't
	*children and it is not in a relationship (target, source)
	*/
	const removeElementInMainGraph=(elementName)=>{
		const listOfProperty=_domainToProperties[elementName] || [];
		if(listOfProperty.length>0){
			listOfProperty.forEach((property,key)=>{
				removePropertyToClass(elementName,property.name);
			})
			
		}
		return _removeClassElement(elementName);
	}

	const removePropertyToClass=(domainClassName,propertyName)=>{
		const propertyObject=_propertiesList.get(propertyName);

		const listOfProperty=_domainToProperties[domainClassName] || [];

		removeElementToArr(listOfProperty,propertyName)
		_propertiesList.delete(propertyName);

		_graphUpdateObject.removePropertyToClass(propertyObject);

		return listOfProperty.slice();
	}

	const removeElementToArr=(arrayList,elementName)=>{
		const index=arrayList.findIndex(function(item){return item.name===elementName})
		if(index>-1){
			arrayList.splice(index,1);
			return elementName;
		}
		return undefined;
	}

	/*
      *if I remove a parent 
      *I have to remove child from parent too(children Obj)  
      */
    const removeChildFromRoot=(currentNode)=>{
      	const rootNode=getRoot(currentNode.type);

      	if(!rootNode.children || rootNode.children.length===0)return;

      	for (var index=0; index<rootNode.children.length; index++){
          const child=rootNode.children[index];
          if(child.name===currentNode.name)break;
      	}
          /*
          *this is for d3 
          */
          rootNode.children.splice(index, 1);
          /*
          *this is for start data
          */
         // parentNode.data.children.slice(index,1);
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
		const [descendantsNode, classesList, entitiesList,objectPropertyList,objectChoiceList] = new formatDataForTreeChart(getRoot());
		_descendantsNode=descendantsNode;
		_classesList=classesList;
		_entitiesList=entitiesList;
		_objectPropertyList=objectPropertyList;
		_objectChoiceList=objectChoiceList;
	}

	const descendantsNodeAsArray=()=>{
		return [..._descendantsNode.values()]
	}

	const savedObjectToWOQL=()=>{
		return _graphUpdateObject.savedObjectToWOQL(_rootIndexObj);
	}

	const updateChoices=(elmentName,choicesList)=>{
		const choiceClass=_rootIndexObj[elementName];
		updateChoices['choices']=choicesList;

		_graphUpdateObject.updateChoicesList(choiceClass)
	}

	const changeElementDataValue=(propName,propValue,elementDataObject)=>{
		/*
		* put the data in the list to save
		*/
		_graphUpdateObject.updateTripleElement(propName,propValue,elementDataObject);
		switch(elementDataObject.type){
			case 'Document':
			case 'Class':
			case 'ChoiseClass':						
				const currentNode=_rootIndexObj[elementDataObject.name];
				currentNode[propName]=propValue;
				break;
			//property case
			default:
				const currentProperty=_propertiesList.get(elementDataObject.name);
				currentProperty[propName]=propValue;
		}
	}

	return {getObjectChoices,getElementsNumber,getElement,getPropertyListByDomain,getObjPropsRelatedToClass,getAvailableParentsList,
      nodeApplyAction,addNewPropertyToClass,removePropertyToClass,changeElementDataValue,
      updateNodeParents,savedObjectToWOQL,getObjectProperties,getDescendantsNode,removeElementInMainGraph}
}