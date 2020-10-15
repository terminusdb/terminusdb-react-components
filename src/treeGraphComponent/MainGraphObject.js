import * as NODE_ACTION_NAME from './utils/actionType';
import {formatData,
		formatProperties,
		formatDataForTreeChart,
		checkInheritance,
		OrdinaryClassObj,
		EntityClassObj,
		availableParentsList} from './FormatDataForTree';

import {graphUpdateObject} from './utils/graphUpdateObject'

export default class MainGraphObject {

	_centralChoicesList=new Map();

	_classesList=new Map();

	_entitiesList=new Map();

    /*
    * all the propertyList ????
    */
	_propertiesList=new Map();

	_objectPropertyList=[];

	_domainToProperties={};

	_objectPropertyToRange={};

	_rootIndexObj={}

	_descendantsNode=new Map();

	_mainGraphElementsJson={};

	_changedElements=new Map();

	_changedToBeSaved={}

	_graphUpdateObject;

	constructor(mainGraphDataProvider){
		/*
		* this function register all the graph changes 
		*/
		this._graphUpdateObject= new graphUpdateObject();

		this.createNewMainGraph(mainGraphDataProvider);
	}



	get elements(){
		return this._mainGraphElementsJson;
	}

	set elements(value){
		this._mainGraphElementsJson=value;
	}

	get changedElements(){
		return this._changedElements;
	}

	get elementsNumber(){
		return {properties:this._propertiesList.size,
		        entities:this._entitiesList.length,
		        ordinaryClasses:this._classesList.length}
	}

	complexPropertyIsActive(){
		if(this._classesList.size===0 && this._entitiesList.size===0){
			return false
		}
		return true;
	}

	classesListArr(){
		return this._classesList;//[...this._classesList.values()];
	}

	entitiesListArr(){
		return this._entitiesList//[...this._entitiesList.values()];
	}

	getRoot(type=null){
		switch(type){
			case 'Class':
			case 'OrdinaryClasses':
				return this._rootIndexObj.OrdinaryClasses;
			case 'Document':
			case 'DocumentClasses':
				return this._rootIndexObj.DocumentClasses;
			default:
			 	return this._rootIndexObj.ROOT;
		}		
	}

	getObjPropsRelatedToClass(nodeId){
		if(this._objectPropertyToRange[nodeId]){
			return this._objectPropertyToRange[nodeId]
		}
		return []
	}

	getObjectPropertyMap(){
		return this._objectPropertyList
	}
	/*
	* maybe I have to get it from _descendantsNode
	*/
	getElement(key){
		if(this._rootIndexObj && this._rootIndexObj[key]){
			return this._rootIndexObj[key];
		}
		return undefined;
	}

	/*
	{classResult:{},
	  propsResult:{},
	  restResult:{}})
	*/
	createNewMainGraph(mainGraphDataProvider){
		this.elements=mainGraphDataProvider;
		this._rootIndexObj=formatData(mainGraphDataProvider.classesResult);		
		const[propertyByDomain,objectPropertyRange]=formatProperties(mainGraphDataProvider.propsResult);
		this._domainToProperties=propertyByDomain;
		this._objectPropertyToRange=objectPropertyRange;
		this.formatDataForTree()
	}
	
	/*
	* child must have the parent parents list plus 1 at list
	* the parent could be the same Type or an Ordinary Class 
	*/
	getElementParents(elements,parentId){

		if(elements[parentId])return elements[parentId].parents || [];

		if(this._mainGraphElementsJson.classes[parentId])
			 return this._mainGraphElementsJson.classes[parentId].parents;

		return [];

	}

	/*
	*elementParents is the parents:[] value from the server
	*elements is the list of OrdinaryClass or EntityClass or Relationship
	*/

	getFirstLevelParentship(elementParents,elements){
		/*
		*if only one parent I don't need to check 
		*/
		if(elementParents.length===1)return elementParents;
		
		const elementP=elementParents.slice(0);//[]
		
		const subParents={};

		for(let i=0; elementParents.length>i; i++){
			/*
			*the parent Name
			*/
			const pName=elementParents[i];
			
			if(subParents[pName])continue;

			const parentParents=this.getElementParents(elements,pName);		
			
			parentParents.forEach((parentPName)=>{
				subParents[parentPName]=true;
				const index=elementP.indexOf(parentPName);
				if(index>-1){
					elementP.splice(index, 1);
				}

			})			
		}
		return elementP;
	}

	getAvailableParentsList(nodeId){
		const nodeObject=this.getElement(nodeId);

		return  availableParentsList(nodeObject,this._classesList,this._entitiesList,this._rootIndexObj)
	}

	addNewPropertyToClass(nodeName, propertyType, propertyRange){
		if(nodeName!==null && this._rootIndexObj[nodeName]){ 
			const newProperty=this._graphUpdateObject.addPropertyToClass(nodeName,propertyType,propertyRange);
			if(!this._domainToProperties[nodeName]){
				this._domainToProperties[nodeName]=[];
			}
			this._domainToProperties[nodeName].unshift(newProperty);
			this._propertiesList.set(newProperty.name,newProperty);
			return  this._domainToProperties[nodeName].slice();
		}
		return [];
	}


	nodeApplyAction(nodeName,actionName){
		if(nodeName!==null && this._rootIndexObj[nodeName]){ 
            let currentNode=this._rootIndexObj[nodeName];
            let elementType=currentNode.type;
            let actionType=actionName;         
   
            switch (actionName){
              case NODE_ACTION_NAME.ADD_NEW_ENTITY:
                   elementType='DocumentClasses';
                   nodeName='DocumentClasses';
                   /*
                   * I get as currentNode the DocumentClasses node 
                   */
                   currentNode=this.getRoot(nodeName);
                   
                   actionType=NODE_ACTION_NAME.ADD_CHILD;
                   
                   break;
              case NODE_ACTION_NAME.ADD_NEW_CLASS:
                   elementType='OrdinaryClasses';
                   nodeName='OrdinaryClasses'
                   currentNode=this.getRoot(elementType);
                   actionType=NODE_ACTION_NAME.ADD_CHILD;
                   
                   break;
            }
        	 let newNodeObj={};
        	 if(actionName===NODE_ACTION_NAME.ADD_PARENT){

        	 	/*
        	 	*I have two case current node child of one Group Node
        	 	*NEW PARENT IS CHILD OF Group Node and has as child the currentNode
        	 	*/
        	 	const rootParentNode=this.getRoot(elementType);

        	 	newNodeObj=this._graphUpdateObject.addNodeToTree(rootParentNode,currentNode);
        		

        	 	rootParentNode.children.push(newNodeObj);

        	 	newNodeObj.children.push(currentNode);     	 	

        	 	if(currentNode.parents.length===0){
        	 		this.removeChildFromRoot(currentNode)
        	 	}
        	 	//currentNode.parents.push[newNodeObj];

        	 	nodeName=rootParentNode.name;
        	 }else{

        	 	newNodeObj=this._graphUpdateObject.addNodeToTree(currentNode);

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
        	 this._rootIndexObj[newNodeObj.name]=newNodeObj;
        	 this.setNewElementPosition(nodeName,newNodeObj);
        	 return newNodeObj;
         }
	}
	
	/*
    *I have to check if the new parent and the node have the same parents.....
    *in this case I have to remove the direct parent
    */
    checkRelatedParents(elementObjClass,parentObjClass){
    	parentObjClass.parents.forEach((parentName)=>{
    		if(elementObjClass._parentsObj.has(parentName)){
    			const sameParent=this._rootIndexObj[parentName];
    			elementObjClass.removeParent(parentName);
				sameParent.removeChild(elementObjClass.name);
    		}
    	})
	}


	updateNodeParents(elementName,parentName,actionName){
	   const elementObjClass=this._rootIndexObj[elementName];
	   const parentObjClass=this._rootIndexObj[parentName];
	   
	   //this.checkRelatedParents(elementObjClass,parentObjClass);

	   this._graphUpdateObject.changeNodeParent(elementName,parentName,actionName);

	   if(actionName===NODE_ACTION_NAME.ADD_PARENT){
	   	    if(elementObjClass.parents.length===0 && 
	   	       parentObjClass.type===elementObjClass.type){
	   	    	this.removeChildFromRoot(elementObjClass);
	   	    }
	   	    //{label:label,name:classId,type:_rootIndexObj[classId].type}
			elementObjClass.parents.push({label:parentObjClass.label,name:parentObjClass.name,type:parentObjClass.type})//(parentName,parentObjClass);
			parentObjClass.children.push(elementObjClass);

		}else{
			this.removeElementToArr(elementObjClass.parents,parentName);
			this.removeElementToArr(parentObjClass.children,elementName);

			//elementObjClass.removeParent(parentName);
			//parentObjClass.removeChild(elementName);
			if(elementObjClass.parents.length===0){
				const parentRoot=this.getRoot(elementObjClass.type);
				parentRoot.children.push(elementObjClass);
				parentName=parentRoot.name;
			}
		}
		/*
		* this is for save the change
		*/
		this.moveNodeUnderParent(parentName,elementName);
		return elementObjClass;
	}

	_removeClassElement(elementName,type){
		const classElement=this._rootIndexObj[elementName];
		if(classElement){
			/*
			*register the remove action
			*/
			classElement.needToSaveRemove();
			/*
			* if this is an UNDO action (ex UNDO of add Parent)
			* I could remove a node with a child
			* so I have to move the child node under 
			* a new parent before delete it 
			*/
			if(classElement._childrenObj.size>0){
				for (let childObj of classElement._childrenObj.values()){
					this.updateNodeParents(childObj.id,elementName,NODE_ACTION_NAME.REMOVE_PARENT)
				}
			}

			/*
			* I have to remove the node from the nodeParents list
			*/
			for (let parentObj of classElement._parentsObj.values()){
				parentObj.removeChild(elementName)
			}

			delete this._rootIndexObj[elementName];
			const nodeElement=this._descendantsNode.get(elementName);			
			this._descendantsNode.delete(elementName);
			
			switch(type){
				case 'OrdinaryClass':
					 this._classesList.delete(elementName);
					 break;
			    case 'EntityClass':
			         this._entitiesList.delete(elementName);
			         break;
			    case 'Relationship':
			    	 this._relationshipList.delete(elementName);
			    	 if(classElement.target){
			    	 	classElement.target.removeInRelationship(elementName);
			    	 }
			    	 if(classElement.source){
			    	 	classElement.source.removeInRelationship(elementName);
			    	 }
			}
			/*
			* I need the node element for UNDO action
			*/
			return nodeElement;
		}
	}

	/*
	*I can remove a node if it hasn't
	*children and it is not in a relationship (target, source)
	*/
	removeElementInMainGraph(elementName,elementType,domainClassName=null){
		if(elementType.indexOf("Property")!==-1){
			return this._removeProperty(elementName,elementType,domainClassName);
		}
		return this._removeClassElement(elementName,elementType);
	}

	removePropertyToClass(domainClassName,propertyName){
		const propertyObject=this._propertiesList.get(propertyName);

		const listOfProperty=this._domainToProperties[domainClassName] || [];

		//const index=listOfProperty.findIndex(function(item){return item.name===propertyName})
		//listOfProperty.splice(index,1);

		this.removeElementToArr(listOfProperty,propertyName)
		this._propertiesList.delete(propertyName);

		this._graphUpdateObject.removePropertyToClass(propertyObject);

		return listOfProperty.slice();
	}

	removeElementToArr(arrayList,elementName){
		const index=arrayList.findIndex(function(item){return item.name===elementName})
		arrayList.splice(index,1);
	}

	/*
      *if I remove a parent 
      *I have to remove child from parent too(children Obj)  
      */
    removeChildFromRoot(currentNode){
      	const rootNode=this.getRoot(currentNode.type);

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

    moveNodeUnderParent(parentId,nodeId){
    	let parentNode=this._descendantsNode.get(parentId);
    	let elementNode=this._descendantsNode.get(nodeId);
        elementNode.parent=parentNode
        elementNode.depth=parentNode.depth+1;
        elementNode.x=parentNode.x+100;
        elementNode.y=parentNode.y+100;
    }

	setNewElementPosition(parentId,newNodeObj,asType){
		let parentNode=this._descendantsNode.get(parentId);
        let yStep=parentNode.y+100;
        let xStep=parentNode.x+100;
        let newNode={}
        newNode.parent=parentNode
        newNode.depth=parentNode.depth+1;
        newNode.x=xStep;
        newNode.y=yStep;
        newNode.data=newNodeObj;
        this._descendantsNode.set(newNodeObj.name,newNode);
	}

	/*
	*For an DELETE
	 ELEMENT UNDO
	*nodeElement is a tree node {x:0,y:0, data:{} ....}
	*/
	addNodeTotreeModel(nodeElement){
		this._descendantsNode.set(nodeElement.data.name,nodeElement);
		this._rootIndexObj[nodeElement.data.name]=nodeElement.data;
		this.elementToTreeModel({[nodeElement.data.name]:nodeElement.data.elementObjForSave()});
	}

	elementToTreeModel(elements){		
		for(let elementId in elements) {
			const elementObj=elements[elementId];
			const parentId=elementObj.parents && elementObj.parents.length>0 ?  elementObj.parents[0] : 'ROOT';

			// add to parent
			const nodeElement=this.createClassElement(elementId,elements);	
			if (parentId!=='ROOT') {
				// create child array if it doesn't exist
				/*
				* check how many parent of first level (direct parent)
				*/
				const firstLevelParents=this.getFirstLevelParentship(elementObj.parents,elements);
				firstLevelParents.forEach((parentName)=>{
					const parentElement=this.createClassElement(parentName,elements);
					parentElement.addChild(elementId,nodeElement);
					nodeElement.addParent(parentName,parentElement,false);
				})
			} else {
				/*
				* parent is null or missing
				* I have get the group parent root
				*/
				this.getRoot(nodeElement.type).children.push(nodeElement);
			}
		}
	}

	getPropertyListByDomain(domainClassName){
		if(this._domainToProperties[domainClassName]) return this._domainToProperties[domainClassName];
		return []
	}

	getProperty(propertyName){
		return this._propertiesList.get(propertyName);
	}

	getPropertyDomain(property){
		return property.domain && property.domain.length>0 ? property.domain[0] : undefined;
	}

	/*
	*create a property class and match it with class 
	*/
	addPropertiesToClass(properties){
		try{
			for (let propertyId in properties){
				const propertyObj=properties[propertyId];
				
				if(propertyObj.type==="SimpleProperty") continue;

				this.addPropertyToClassObj(propertyId,propertyObj);
			}
		}catch(err){
			console.log("PROPERTY TO CLASS",err.message);
		}
			
	}

	addPropertyToClassObj(propertyId,propertyObj){
		const className=this.getPropertyDomain(propertyObj);

		if(this._rootIndexObj[className]){
			const classObj=this._rootIndexObj[className];
			classObj.addProperty(propertyId,propertyObj.type,propertyObj);
		}
	}


	formatDataForTree(){
		const [descendantsNode, classesList, entitiesList,objectPropertyList] = new formatDataForTreeChart(this.getRoot());
		this._descendantsNode=descendantsNode;
		this._classesList=classesList;
		this._entitiesList=entitiesList;
		this._objectPropertyList=objectPropertyList;
	}

	get descendantsNode(){
		return this._descendantsNode
	}

	descendantsNodeAsArray(){
		return [...this._descendantsNode.values()]
	}

	savedObjectToWOQL(){
		return this._graphUpdateObject.savedObjectToWOQL();
	}

	changeElementDataValue(propName,propValue,elementDataObject){
		/*
		* put the data in the list to save
		*/
		this._graphUpdateObject.updateTripleElement(propName,propValue,elementDataObject);
		switch(elementDataObject.type){
			case 'Document':
			case 'Class':							
				const currentNode=this._rootIndexObj[elementDataObject.name];
				currentNode[propName]=propValue;
				break;
			//property case
			default:
				const currentProperty=this._propertiesList.get(elementDataObject.name);
				currentProperty[propName]=propValue;
		}
	}
}