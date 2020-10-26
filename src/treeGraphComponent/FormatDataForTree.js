import { tree, hierarchy } from 'd3-hierarchy';
import {CLASS_TYPE_NAME,
		PROPERTY_TYPE_NAME,
		PROPERTY_STRING_BY_RANGE,
		PROPERTY_NUMBER_BY_RANGE,
		PROPERTY_GEO_BY_RANGE,
		PROPERTY_TEMPORAL_BY_RANGE} from '../constants/details-labels'

const addTypeRange=(item,newProperty,_rootIndexObj) =>{
	const range=item["Property Range"]

	/*
	* I have 2 types of special property LinkProperty and ChoiceProperty
 	*/
	if(range.startsWith("terminusdb:///schema#")){
		newProperty['range']=range;
		if(_rootIndexObj[range] && _rootIndexObj[range].type===CLASS_TYPE_NAME.CHOICE_CLASS){
			newProperty['type']=PROPERTY_TYPE_NAME.CHOICE_PROPERTY
		}else{
			newProperty['type']=PROPERTY_TYPE_NAME.OBJECT_PROPERTY;
		}		 
		return;
	}
	//"http://terminusdb.com/schema/xdd#url"
	const rangeArr=range.split('#');
	const rangeStr=rangeArr[1];
	
	if(PROPERTY_STRING_BY_RANGE[rangeStr]){
		newProperty['range']=PROPERTY_STRING_BY_RANGE[rangeStr];
		newProperty['type']=PROPERTY_TYPE_NAME.STRING_PROPERTY;
		return
	}

	if(PROPERTY_NUMBER_BY_RANGE[rangeStr]){
		newProperty['range']=PROPERTY_NUMBER_BY_RANGE[rangeStr];
		newProperty['type']=PROPERTY_TYPE_NAME.NUMERIC_PROPERTY;
		return
	}

	if(PROPERTY_GEO_BY_RANGE[rangeStr]){
		newProperty['range']=PROPERTY_GEO_BY_RANGE[rangeStr];
		newProperty['type']=PROPERTY_TYPE_NAME.GEO_PROPERTY;
		return
	}

	if(PROPERTY_TEMPORAL_BY_RANGE[rangeStr]){
		newProperty['range']=PROPERTY_TEMPORAL_BY_RANGE[rangeStr];
		newProperty['type']=PROPERTY_TYPE_NAME.TEMPORAL_PROPERTY;
		return
	}	
}

/*
* add restrictions to properties
*/
export const addRestictionToProps=(propertiesList,restrDataProvider)=>{
	const bindings = restrDataProvider.bindings || [];
	bindings.forEach((item)=>{
		const property=propertiesList.get(item['Property']);
		if(property){
			if(item.cardinality!=="system:unknown"){
				property['cardinality']=item.cardinality['@value'];
			}
			if(item.min!=="system:unknown"){
				property['min']=item.min['@value'];
			}
			if(item.max!=="system:unknown"){
				property['max']=item.max['@value'];
			}
		}
	})
}

export const formatProperties=(dataProvider,restrDataProvider,_rootIndexObj)=>{

	const propertyByDomain={}
	const objectPropertyRange={}
	const propertiesList=new Map()

	const bindings = dataProvider.bindings || [];

	bindings.forEach((item)=>{
		const classDomain=item['Property Domain'];

		if(!propertyByDomain[classDomain]){
			propertyByDomain[classDomain]=[]
		}

		const newProperty={name:item['Property ID'],
						  id: item['Property ID'],
				          label:item['Property Name']['@value'],
				          comment:item['Property Description']['@value'],
				          newElement:false,
				          domain:classDomain
						}

		addTypeRange(item,newProperty,_rootIndexObj);

		if(newProperty.type===PROPERTY_TYPE_NAME.OBJECT_PROPERTY){
			if(!objectPropertyRange[newProperty.range]){
				objectPropertyRange[newProperty.range]=[]
			}
			
			//the item range is the Class-range of the ObjectProperty
			
			objectPropertyRange[newProperty.range].push({label:newProperty.label, name:newProperty.name})
		}
		propertiesList.set(newProperty.name,newProperty);

		propertyByDomain[classDomain].push(newProperty)
	})
	/*
	* add cardinality restrictions
	*/
	addRestictionToProps(propertiesList,restrDataProvider);

	return [propertyByDomain,objectPropertyRange,propertiesList];


}

export const formatData =(dataProvider)=>{

	let _rootIndexObj={ROOT:{"name": "ROOT", type:'ROOT', "label":"Main Graph", "children":[],"comment":'ROOT'},

					   		OrdinaryClasses:{name:"OrdinaryClasses",type:"Group", parents:[],
										    label:"Ordinary Classes ","children":[],comment:'Ordinary Classes'},
		               		DocumentClasses:{name:'DocumentClasses', parents:[],
		                              type:"Group",label:"Document Classes","children":[],comment:'Document Classes'}}



		                             //_rootIndexObj.OrdinaryClasses,_rootIndexObj.DocumentClasses
	_rootIndexObj.ROOT.children.push(_rootIndexObj.OrdinaryClasses);
	_rootIndexObj.ROOT.children.push(_rootIndexObj.DocumentClasses);
	                             
	addElements(_rootIndexObj,dataProvider)

	return _rootIndexObj;
}


export const formatDataForTreeChart =(rootElement)=>{
	const treeModel = tree();
	/*
	* When you set a size for the tree,Vtree$$1.size(size); 
	* you are setting a fixed size so that the tree has to conform to that width and height.  
	* When you set a nodeSize, the tree has to be dynamic so it resets the size of the tree.
	*/

    treeModel.nodeSize([200,200]);
         
    const data=hierarchy(rootElement);
    const d3Data = treeModel(data);
     
    const treeNode=d3Data.descendants();

    const descendantsNode = new Map();
    const classesList=new Map();
	const entitiesList=new Map();
	const objectPropertyList=[];
	const objectChoiceList=[];

	//this._descendantsNode=new Map();
    for(let node of treeNode){
       /*if(node.data.type==='Group' && node.x && Math.abs(node.x)<200){
       		node.x=node.x*2;
       		//node.y=node.y/1.5;
       }*/
       if(node.data.type==='Document'){
       		entitiesList.set(node.data.name,{value:node.data.name,name:node.data.name,label:node.data.label});
       		objectPropertyList.push({type:node.data.type,value:node.data.name,name:node.data.name,label:node.data.label})
       }else if (node.data.type==='Class'){
       		classesList.set(node.data.name,{value:node.data.name,name:node.data.name,label:node.data.label});
       		objectPropertyList.push({type:node.data.type,value:node.data.name,name:node.data.name,label:node.data.label})
       }else if (node.data.type===CLASS_TYPE_NAME.CHOICE_CLASS){
       		objectChoiceList.push({value:node.data.name,name:node.data.name,label:node.data.label});
       }
       
       descendantsNode.set(node.data.name,node);  
    }

    return [descendantsNode,classesList,entitiesList,objectPropertyList,objectChoiceList];
}

const SCOPED_VALUE_ID="terminusdb:///schema#ScopedValue";
const BOX_ID="terminusdb:///schema#Box";

const getLabel=(item) =>{
	if(item['Class Name']['@value']){
		return item['Class Name']['@value']
	}
	//const classId=item['Class ID'];
}
//terminusdb:///schema#Box
const getId=(classId) =>{
	
	return classId.replace("terminusdb:///schema#","");
}

/*
* abstract value 'Yes/No'
*/
const getAbstractValue=(item)=>{
	return item['Abstract']['@value']==='Yes' ? true : false;
}


const checkOrdinaryClassType=(classElement,item)=>{
	if(item["Choices"]!=="system:unknown" && Array.isArray(item["Choices"])){
		const choicesList=[]
		item["Choices"].forEach((choise)=>{
			const  choiseId=getId(choise[0]);
			const  choiseLabel=choise[1]['@value'];
			const  choiseComment=choise[2]['@value'];
			choicesList.push({id:choiseId,label:choiseLabel,comment:choiseComment})

		})
		classElement['type']='ChoiceClass';
		classElement['choices']=choicesList;
	}else{
		classElement['type']='Class';
	}
}

	
//_rootIndexObj.OrdinaryClasses,_rootIndexObj.DocumentClasses
const addElements=( _rootIndexObj, dataProvider=[])=>{

	//const _rootIndexObj={}
	const bindings = dataProvider.bindings || [];
	
	bindings.forEach((item)=>{
		const classId=item['Class ID'];
		const label=getLabel(item)
		const description=item['Description']['@value'];
		const abstract=getAbstractValue(item);
		/*
		"Parents": {"@type":"http://www.w3.org/2001/XMLSchema#string", "@value":""}
		*/
		if(classId!==SCOPED_VALUE_ID && classId!==BOX_ID){
			if(!_rootIndexObj[classId]){
				_rootIndexObj[classId]={}		
				_rootIndexObj[classId]['children']=[];
				_rootIndexObj[classId]['parents']=[];
				_rootIndexObj[classId]['name']=classId;
				_rootIndexObj[classId]['hasConstraints']=false;
				_rootIndexObj[classId]['id']=getId(classId);	
			}

			_rootIndexObj[classId]['abstract']=abstract;		
			_rootIndexObj[classId]['label']=label;
			_rootIndexObj[classId]['comment']=description;

			//add for children
			if(Array.isArray(item['Parents'])){
				const parentNum=item['Parents'].length;

				item['Parents'].forEach((parentId)=>{

					//const parentId=parent[0]
					//if parent is document type is 'DocumentClass'

					if(parentId==='http://terminusdb.com/schema/system#Document'){
						_rootIndexObj[classId]['type']='Document'
						if(parentNum===1){
							_rootIndexObj.DocumentClasses.children.push(_rootIndexObj[classId])
							//_rootIndexObj[classId].parents=['DocumentClass']
						}
					//if get type from the parent
					}else if(_rootIndexObj[parentId] && _rootIndexObj[parentId]['type']){
						
						_rootIndexObj[classId]['type']=_rootIndexObj[parentId].type;
					}
				})
			}else{
				/*
				* check if it is a choiseClass
				* special class No properties no children
				*/
			 	checkOrdinaryClassType(_rootIndexObj[classId],item);
				_rootIndexObj.OrdinaryClasses.children.push(_rootIndexObj[classId]);
				//_rootIndexObj[classId].parents=['OrdinaryClasses']
			}

			//add for children
			if(Array.isArray(item['Children']) ){//&& classId==="terminusdb:///schema#Organization"){
				/*
				* I can't remove this node before move or remove all the children
				*/
				_rootIndexObj[classId].hasConstraints=true;

				item['Children'].forEach((childId)=>{
					if(!_rootIndexObj[childId]){
						_rootIndexObj[childId]={}
						_rootIndexObj[childId]['name']=childId
						_rootIndexObj[childId]['id']=getId(childId)
						_rootIndexObj[childId]['children']=[]
						_rootIndexObj[childId]['hasConstraints']=false
						_rootIndexObj[childId]['parents']=[]
					}

					if(_rootIndexObj[classId].type){
						_rootIndexObj[childId]['type']=_rootIndexObj[classId].type;
					}
					
					_rootIndexObj[childId]['parents'].push({label:label,name:classId,type:_rootIndexObj[classId].type});
					//add child to the current node
					_rootIndexObj[classId]['children'].push(_rootIndexObj[childId])

				})
			}
		}
	})
}

/*
*the list of available parents depends on the type of node
*the list can not have the node currents parents or the currents children
*Ordinary Class can inherit only from Ordinary Classes 
*Entity Class can inherit from Ordinary Classes and Entity Classes
*Relationship Class can inherit from Ordinary Classes and Relationship
*/

export const availableParentsList = (classObj,classesMap,documentMap,_rootIndexObj)=>{
	const resultListObject={};
	resultListObject['documentClassArr']=[]	
	resultListObject['objectClassArr']=removeRelatedElements(classObj,classesMap,_rootIndexObj);
	if(classObj.type==="Document")
		resultListObject['documentClassArr']=removeRelatedElements(classObj,documentMap,_rootIndexObj);
	return resultListObject;
}

const removeRelatedElements=(classObj,classesMap,_rootIndexObj)=>{
	if(classesMap.size===0)return [];

	const objectClassMap=new Map(classesMap)
	
	if(objectClassMap.has(classObj.name)){
		objectClassMap.delete(classObj.name);
	}
	removeRelatedChildren(classObj.children,objectClassMap);
	removeRelatedParent(classObj.parents,objectClassMap,_rootIndexObj)
	
	return [...objectClassMap.values()]
}

/*
* recursive remove related parents
*/

const removeRelatedParent=(parentsList,classesMap,_rootIndexObj)=>{
	parentsList.forEach((childObj,key)=>{
		if(classesMap.has(childObj.name)){
			classesMap.delete(childObj.name)
		}
		
		const parentObj=_rootIndexObj[childObj.name];
		removeRelatedParent(parentObj.parents,classesMap,_rootIndexObj);
	})
}

/*
* recursive remove related children
*/
const removeRelatedChildren=(childrenList,classList)=>{
	childrenList.forEach((childObj,key)=>{
		if(classList.has(childObj.name)){
			classList.delete(childObj.name)
		}
		removeRelatedChildren(childObj.children,classList);
	})
}


export const rootObjectName={ROOT:true,
	                  OrdinaryClassesGroup:true,
	                  DocumentClasses:true}
