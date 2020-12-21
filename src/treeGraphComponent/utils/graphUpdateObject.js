import {ADD_PARENT, REMOVE_PARENT} from './actionType'
import TerminusClient from '@terminusdb/terminusdb-client'
import {PROPERTY_TYPE_NAME,CLASS_TYPE_NAME} from '../utils/elementsName'
import {getNewNodeTemplate} from '../utils/modelTreeUtils'
import {UTILS} from "@terminusdb/terminusdb-client"

export const graphUpdateObject=()=>{
	const newNodesList = new Map()
	const newPropertiesList =new Map()

	const deleteNodesList = new Map()
	const deletePropertiesList= new Map()

	const updateChoiceList= new Map()

	const updateTriple=new Map()

	/*
	* for the interface I can change the parentship from child to parent
	*/
	const changeParentList=new Map()

	const addParent=(currentNode,newNode,isChoiceClass)=>{
		if(currentNode.type===CLASS_TYPE_NAME.SCHEMA_GROUP ){
			if(currentNode.name===CLASS_TYPE_NAME.DOCUMENT_CLASSES){
				newNode.parent=['Document']
				newNode.parents=[]
				newNode.type=CLASS_TYPE_NAME.DOCUMENT_CLASS
			}else{
				newNode.parent=[]
				newNode.parents=[]
				let nodeType=CLASS_TYPE_NAME.OBJECT_CLASS
				if(isChoiceClass){
					nodeType=CLASS_TYPE_NAME.CHOICE_CLASS
					newNode.choices=[]
				}
				newNode.type=nodeType
			}
		}else{
			newNode.parent=[currentNode.id]
			newNode.parents=[currentNode.name]
			newNode.type=currentNode.type
		}

	}

	const updateChoicesList=(choiceClass)=>{
		if(choiceClass.newElement===true)return
		updateChoiceList.set(choiceClass.name,choiceClass);
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

	/*
	* newNodeParent : parent of the new node 
	* newNodeChild  : child of the new node
	*/
	const addNodeToTree=(newNodeParent,newNodeChild=null,isChoiceClass=false)=>{
		let elementModel=getNewNodeTemplate()
		
		addParent(newNodeParent,elementModel,isChoiceClass)
		
		newNodesList.set(elementModel['name'],elementModel);

		if(newNodeChild){
			/*
			* add the parent relationship to the child node
			*/
			changeNodeParent(newNodeChild.name,elementModel['name'],ADD_PARENT)
			newNodeChild.parents.push(elementModel['name'])
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
							id: "",
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
		/*
		* add the prefix for save the property
		*/
		copyNode.id=checkNewId(propertyObj.id);
		return copyNode
	}

	/*
	* the new node has not the prefix I have to add the prefix
	*/
	const getRealId = (elementName)=>{
		if(newNodesList.has(elementName)){
			return checkNewId(newNodesList.get(elementName).id)
		}
		return elementName;	
	}

	const checkNewId=(id)=>{
		if(id.indexOf(":")===-1){
			return `scm:${id}`
		}
		return id;
	}

	const formatChoiceListForWoql = (choicelist)=>{
		const choices=[]
		choicelist.forEach((item)=>{
			const id= checkNewId(item.id)
			const choiceArr=[id,item.label,item.comment]
			choices.push(choiceArr);
		})
		return choices;
	}

	const savedObjectToWOQL = ()=>{
		let WOQL = TerminusClient.WOQL
		const andValues = []
		newNodesList.forEach((node,key) =>{
			/*if(node.id===undefined){
				alert(`The node ${node.name}`)
			}*/

			if(node.type!==CLASS_TYPE_NAME.CHOICE_CLASS){
				const newNode={id:node.id,
							   label:node.label,
							   description:node.comment,
							   parent:node.parent,
							   abstract:node.abstract}			 
				andValues.push(WOQL.insert_class_data(newNode))
			}else{
				const choices=formatChoiceListForWoql(node.choices)
				andValues.push(WOQL.generateChoiceList(node.id, node.label, node.comment, choices))
			}
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
					if(vname==='abstract'){
						andValues.push(updateAbstract(WOQL,subjectId,valuesObject[vname]))
					}else{
						andValues.push(WOQL.update_quad(subjectId,vname,valuesObject[vname],'schema/main'))
					}
 					 					
 				}
			}			
		})

		deleteNodesList.forEach((nodeObj)=>{
			const varName=`v:${nodeObj.id}`
			andValues.push(WOQL.delete_class(nodeObj.name,null,varName));
		})

		deletePropertiesList.forEach((proObj)=>{
			const varName=`v:${proObj.id}`
			andValues.push(WOQL.delete_property(proObj.name,null,varName));
		})

		/*
		* if I change somethingin the choicelist I have to remove and add again
		*/
		updateChoiceList.forEach((choiceObj,choiceName)=>{
			const choiceId=getRealId(choiceName)
			const choices=formatChoiceListForWoql(choiceObj.choices)
			andValues.push(WOQL.updateChoiceList(choiceId, choiceObj.label, choiceObj.comment, choices))
		})

		if(andValues.length===0)return undefined;
		const query = WOQL.and(...andValues);
		return query
	}

	const updateAbstract=(WOQL,subjectId,value)=>{
		if(value===true){
			return WOQL.update_quad(subjectId,'system:tag','system:abstract','schema/main')
		}
		
		return WOQL.opt(
	          WOQL.quad(subjectId, 'system:tag', "system:abstract", "schema/main")
	          .delete_quad(subjectId, 'system:tag', "system:abstract", "schema/main")
	    )
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
	return {updateChoicesList,addNodeToTree,changeNodeParent,addPropertyToClass,removePropertyToClass,savedObjectToWOQL,removeNode,updateTripleElement}
}

//new node 
//new property
/*

*/

//update triple (value to a prop)
//cardinality (change chardinality value)

//if they change locally like add new node remove new node 
//if they remove or change some
