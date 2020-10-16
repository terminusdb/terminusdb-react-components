/*
let choices = [
        ["scm:inferred", "Inferred", "The value has been logically inferred from other evidence"],
        ["scm:disputed", "Disputed", "The evidence is disputed - some believe this data to be incorrect"],
        ["scm:dubious", "Dubious", "The evidence is dubious - most believe this data to be incorrect"],
        ["scm:uncertain", "Uncertain", "The evidence has a high degree of uncertainty"]
    ]

 WOQL.generateChoiceList("scm:Confidence", "Confidence Tags", "Tags that can be added to values to indicate confidence in the value of some piece data", choices)
[5:55 PM]
add_property('my_property', "scm:Confidence")....*/

import {ADD_PARENT, REMOVE_PARENT} from './actionType';  
import TerminusClient from '@terminusdb/terminusdb-client';
import {PROPERTY_TYPE_NAME} from '../../constants/details-labels'

export const graphUpdateObject=()=>{
	const newNodesList = new Map()
	const newPropertiesList =new Map()

	const deleteNodesList = new Map()
	const deletePropertiesList= new Map()

	const updateTriple=new Map()

	/*
	* for the interface I can change the parentship from child to parent
	*/
	const changeParentList=new Map()

	const addParent=(currentNode,newNode)=>{
		if(currentNode.type==='Group' ){
			if(currentNode.name==="DocumentClasses"){
				newNode.parent=['Document']
				newNode.parents=[]
				newNode.type='Document'
			}else{
				newNode.parent=[]
				newNode.parents=[]
				newNode.type='Class'
			}
		}else{
			newNode.parent=[currentNode.id]
			newNode.parents=[{name:currentNode.name,label:currentNode.label,type:currentNode.type}]
			newNode.type=currentNode.type
		}

	}

	/*
	* name is internal unique reference 
	*/
	const updateTripleElement=(propName,propValue,currentElement)=>{
		/*
		* I don't need to add a triple change because this is a new node
		*/
		if(currentElement.newElement===true)return;
		let values={}
		if(updateTriple.has(currentElement.name)){
			values=updateTriple.get(currentElement.name);
			values[propName]=propValue;
		}else{
			values[propName]=propValue;
			updateTriple.set(currentElement.name,values);
		}
		/*
		* if the element is a property
		*/
		if(currentElement.domain){
			values['domain']=currentElement.domain;
		}		
	}
  


	const addNodeToTree=(currentNode,addParentToNode=null)=>{
		const newName=`CLASS_${(new Date()).getTime()}`;
		let elementModel={
						 name:newName,
						 id: "NEW NODE",
			             label:"NEW NODE",
			             comment:"",
			             hasConstraints:false,
			             newElement:true,
			             children:[],
			             abstract:false
		          		}

		addParent(currentNode,elementModel)
		
		newNodesList.set(newName,elementModel);

		if(addParentToNode){
			changeNodeParent(addParentToNode.name,newName,ADD_PARENT)
		}

		return elementModel;
	}

	const changeNodeParent=(childName,parentName,action)=>{
		let parentsList=[]

		if(changeParentList.has(childName)){
			parentsList=changeParentList.get(childName);
		}else{
			changeParentList.set(childName,parentsList);
		}

		parentsList.push({childNode:childName,
						 parentNode:parentName,action:action})
	}

	const removeNode=(nodeObj) =>{
		if(nodeObj.newElement===true){
			newNodesList.delete(nodeObj.name);
		}else{
			deleteNodesList.set(nodeObj.name,nodeObj);
		}
	}

	/*
	* add a new property when I'll save 
	* I have to replace the domain if the property is for a new node 
	*/
	const addPropertyToClass=(domainNodeName,propertyType,propertyRange)=>{
		const newName=`PROPERTY_${(new Date()).getTime()}`;
		let elementModel={
							name:newName,
							id: "NEW PROPERTY ID",
				            label:"NEW PROPERTY",
				            comment:"",
				            type:propertyType,
				            newElement:true,
				            range:propertyRange,
				            domain:domainNodeName
		          		}

		newPropertiesList.set(newName,elementModel)
		
		return elementModel;

	}

	const removePropertyToClass=(propertyObject)=>{
		/*
		* if the property is only local (not saved in the db) 
		* I can remove it from the list 
		*/
		if(propertyObject.newElement===true){
			newPropertiesList.delete(propertyObject.name);
		}else{
			deletePropertiesList.set(propertyObject.name,propertyObject);
		}

	}
	/*
	* In new node we use a internal name for reference 
	*/
	const getPropertyObjForSave=(propertyObj)=>{
		let copyNode = JSON.parse(JSON.stringify(propertyObj));
		copyNode.description=copyNode.comment;
		copyNode['domain']=getRealId(copyNode.domain);
	
		if(propertyObj.type===PROPERTY_TYPE_NAME.OBJECT_PROPERTY){
			copyNode['range']=getRealId(copyNode.range);
		}
		return copyNode
	}

	const getRealId = (elementName)=>{//scm:bike_parent_003
		if(newNodesList.has(elementName)){
			return `scm:${newNodesList.get(elementName).id}`
		}
		return elementName;
		//const arr = elementName.split("#")
		//return `scm:${arr[1]}`	
	}

	const savedObjectToWOQL = ()=>{
		let WOQL = TerminusClient.WOQL
		const andValues = []
		newNodesList.forEach((node,key) =>{
			const newNode={id:node.id,
						   label:node.label,
						   description:node.comment,
						   parent:node.parent,
						   abstract:node.abstract} 
			andValues.push(WOQL.insert_class_data(newNode))
		})

		newPropertiesList.forEach((property,key) =>{
			const propertyObj = getPropertyObjForSave(property);
			andValues.push(WOQL.insert_property_data(propertyObj))
		})

		changeParentList.forEach((parentActArr,key)=>{
			parentActArr.forEach((item,key)=>{
				const idChild=getRealId(item.childNode);
				const idParent=getRealId(item.parentNode);

				switch(item.action){
					case ADD_PARENT:
						andValues.push(WOQL.add_quad(idChild, "subClassOf", idParent, "schema/main"))
						break;
					case REMOVE_PARENT:	
						andValues.push(WOQL.delete_quad(idChild, "subClassOf", idParent, "schema/main"))

				}
			})		
		})

		updateTriple.forEach((valuesObject,subject) =>{
			const subjectId=getRealId(subject)
			for (const vname in valuesObject) {
				if(vname==="domain")continue;								
				if(['min','max','cardinality'].indexOf(vname)>-1){
					andValues.push(updateCardinality(WOQL,subjectId,vname,valuesObject[vname],valuesObject['domain']))
				}else{
 					andValues.push(WOQL.update_quad(subjectId,vname,valuesObject[vname],'schema/main')) 					
 				}
			}			
		})

		deleteNodesList.forEach((nodeObj)=>{
			andValues.push(WOQL.delete_class(nodeObj.name));
		})

		deletePropertiesList.forEach((proObj)=>{
			andValues.push(WOQL.delete_property(proObj.name));
		})


		const query = WOQL.and(...andValues);
		return query
	}

	/*
	*to be review if I have both and I like to update only one 
	*maybe I don't have to remove all the retriction
	*/
	const updateCardinality=(WOQL,subjectId,vname,value,domain)=>{
		const cardType={max:'owl:maxCardinality',min:'owl:minCardinality'}

		const cardName= subjectId + '_' + vname + '_' + value;
		const cardTypeName=cardType[vname]
		const domainId=getRealId(domain);
		return WOQL.and(
      			WOQL.opt(
          				WOQL.quad("v:Restriction", "owl:onProperty", subjectId, "schema/main")
          				.delete_quad("v:Restriction", "owl:onProperty", subjectId, "schema/main")
      				),
		      WOQL.add_quad(cardName, "type", "owl:Restriction", "schema/main")
		    	  .add_quad(cardName, "owl:onProperty", subjectId, "schema/main")
		          .add_quad(cardName, cardTypeName, WOQL.literal(value, "xsd:nonNegativeInteger"), "schema/main")
		          .add_quad(domainId, "subClassOf", cardName, "schema/main")
		)
	}

	return {addNodeToTree,changeNodeParent,addPropertyToClass,removePropertyToClass,savedObjectToWOQL,removeNode,updateTripleElement}
}

//new node 
//new property
/*

*/

//update triple (value to a prop)
//cardinality (change chardinality value)

//if they change locally like add new node remove new node 
//if they remove or change some
