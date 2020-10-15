 /*and(
         opt().triple("doc:test", "label", "v:label").delete_triple("doc:test", "label", "v:label"),
          add_triple("doc:test", "label", "New label")

      16: add_quad("MyClass", "subClassOf", "Parent", "schema/main")
   17: delete_quad("MyClass", "subClassOf", "Parent", "schema/main")
   */
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
	}
  


	const addNodeToTree=(currentNode,addParentToNode=null)=>{
		const newName=`CLASS_${(new Date()).getTime()}`;
		let elementModel={
						 name:newName,
						 id: "NEW NODE",
			             label:"NEW NODE",
			             description:"",
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

	const removeNode=(currentNode) =>{
		deleteNodesList.set(currentNode.name,currentNode);
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
				            description:"",
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
		return elementName		
	}

	const savedObjectToWOQL = ()=>{
		let WOQL = TerminusClient.WOQL
		const andValues = []
		newNodesList.forEach((node,key) =>{
			const newNode={id:node.id,
						   label:node.label,
						   description:node.description,
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

		//updateTriple.forEach((propertyObject,key)) =>{
		//	andValues.push(updateTriple))
		//}


		const query = WOQL.and(...andValues);
		return query
	}

	
	const woqlUpdateTriple=(subject,predicate,objectValue)=>{
		let WOQL = TerminusClient.WOQL
		return WOQL.and(
     		WOQL.opt().triple(subject, predicate, "v:Obj").delete_triple(subject, predicate, "v:Obj"),
     		WOQL.add_triple(subject, predicate, objectValue)
		)	
	}

	return {addNodeToTree,changeNodeParent,addPropertyToClass,removePropertyToClass,savedObjectToWOQL,removeNode,updateTripleElement}
}

//new node 
//new property


//update triple (value to a prop)
//cardinality (change chardinality value)

//if they change locally like add new node remove new node 
//if they remove or change some
