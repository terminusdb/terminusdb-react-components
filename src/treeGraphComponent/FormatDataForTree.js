import { tree, hierarchy } from 'd3-hierarchy';
import {PROPERTY_TYPE_NAME, CLASS_TYPE_NAME, getRootIndexObj} from './utils/elementsName';
import {PROPERTY_STRING_BY_RANGE,
		PROPERTY_NUMBER_BY_RANGE,
		PROPERTY_GEO_BY_RANGE,
		PROPERTY_TEMPORAL_BY_RANGE} from '../constants/details-labels'
import {removeElementToArr} from './utils/modelTreeUtils'

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
						  id: getId(item['Property ID']),
				          label:item['Property Name']['@value'],
				          comment:item['Property Description']['@value'],
				          newElement:false,
				          domain:classDomain
						}

		addTypeRange(item,newProperty,_rootIndexObj);

		if(newProperty.type===PROPERTY_TYPE_NAME.OBJECT_PROPERTY || newProperty.type===PROPERTY_TYPE_NAME.CHOICE_PROPERTY){
            // newProperty.range is the className
            if(newProperty.domain && _rootIndexObj[newProperty.domain]){
    			const classDomain=_rootIndexObj[newProperty.domain];
                addObjectPropertyRangeItem(objectPropertyRange,newProperty,classDomain)
            }
            else if(newProperty.domain && !_rootIndexObj[newProperty.domain]){
                alert(newProperty.domain )
            }
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

/*
* to be review of don't get the label change
*/
export const addObjectPropertyRangeItem=(objectPropertyRange,propertyElement,classDomain,previewRange=undefined)=>{
	/*
	* remove the relation
	*/
	if(previewRange){
		const arrList=objectPropertyRange[previewRange];
		if(arrList){ 
			if(arrList.length===1)objectPropertyRange[previewRange]=[];
			const index=arrList.findIndex((item)=>{return item.name===propertyElement.name})
			arrList.splice(index,1)
		}
		//const index= arrList.find(propertyElement.name);
	}
	if(!objectPropertyRange[propertyElement.range]){
		 objectPropertyRange[propertyElement.range]=[]
	}
	objectPropertyRange[propertyElement.range].push(propertyElement)
											
}

export const formatData =(dataProvider,dbName)=>{
	let _rootIndexObj=getRootIndexObj(dbName);	
	_rootIndexObj.ROOT.children.push(_rootIndexObj[CLASS_TYPE_NAME.CHOICE_CLASSES]);
	_rootIndexObj.ROOT.children.push(_rootIndexObj[CLASS_TYPE_NAME.OBJECT_CLASSES]);	
	_rootIndexObj.ROOT.children.push(_rootIndexObj[CLASS_TYPE_NAME.DOCUMENT_CLASSES]);
	                             
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

   // treeModel.nodeSize([200,200]);

    treeModel.nodeSize([150,400]);
    //treeModel.size([5000, 1000])   
    const data=hierarchy(rootElement);
    const d3Data = treeModel(data);
     
    const treeNode=d3Data.descendants();

    const descendantsNode = new Map();
    
    /*
    * list of all object class id
    */
    const objectTypeList=[];
    /*
    *list of all Document class id
    */
	const documentTypeList=[];


	const objectPropertyList=[];
	const objectChoiceList=[];


	//this._descendantsNode=new Map();
    for(let node of treeNode){
       /*if(node.data.type==='Group' && node.x && Math.abs(node.x)<200){
       		node.x=node.x*2;
       		//node.y=node.y/1.5;
       }*/
       if(!descendantsNode.has(node.data.name)){
	       if(node.data.type===CLASS_TYPE_NAME.DOCUMENT_CLASS){
	       		documentTypeList.push(node.data.name);
	      		objectPropertyList.push({type:node.data.type,value:node.data.name,name:node.data.name,label:node.data.label})
	       }else if (node.data.type===CLASS_TYPE_NAME.OBJECT_CLASS){
	       		objectTypeList.push(node.data.name);
	       		objectPropertyList.push({type:node.data.type,value:node.data.name,name:node.data.name,label:node.data.label})
	       }else if (node.data.type===CLASS_TYPE_NAME.CHOICE_CLASS){
	       		objectChoiceList.push({value:node.data.name,name:node.data.name,label:node.data.label});
	       }	        	       	   	
	   }
	   descendantsNode.set(node.data.name,node);      
    }

    return [descendantsNode,objectTypeList,documentTypeList,objectPropertyList,objectChoiceList];
}

export const addElementToPropertyList=(elementsObj,objectPropertyList)=>{
   		objectPropertyList.push({type:elementsObj.type,
   								 value:elementsObj.name,
   								 name:elementsObj.name,
   								 label:elementsObj.label})
       
}



const SCOPED_VALUE_ID="terminusdb:///schema#ScopedValue";
const BOX_ID="terminusdb:///schema#Box";

const getLabel=(item,idName) =>{
	if(item['Class Name']['@value']){
		return item['Class Name']['@value']
	}
	return idName
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


const checkOrdinaryClassType=(classElement,item,_rootIndexObj)=>{
	if(item["Choices"]!=="system:unknown" && Array.isArray(item["Choices"])){
		const choicesList=[]
		item["Choices"].forEach((choise)=>{
			const  choiseId=getId(choise[0]);
			const  choiseLabel=choise[1]['@value'];
			const  choiseComment=choise[2]['@value'];
			choicesList.push({id:choiseId,label:choiseLabel,comment:choiseComment})

		})
		classElement['type']=CLASS_TYPE_NAME.CHOICE_CLASS;
		classElement['choices']=choicesList;
		_rootIndexObj[CLASS_TYPE_NAME.CHOICE_CLASSES].children.push(classElement)
	}else{
		classElement['type']=CLASS_TYPE_NAME.OBJECT_CLASS;
		_rootIndexObj[CLASS_TYPE_NAME.OBJECT_CLASSES].children.push(classElement)
	}
}

	
const addElements=( _rootIndexObj, dataProvider=[])=>{

	//const _rootIndexObj={}
	const bindings = dataProvider.bindings || [];
	
	bindings.forEach((item)=>{
		const classId=item['Class ID'];
		const description=item['Description']['@value'];
		const abstract=getAbstractValue(item);
		/*
		"Parents": {"@type":"http://www.w3.org/2001/XMLSchema#string", "@value":""}
		*/
		//if(classId!==SCOPED_VALUE_ID && classId!==BOX_ID){
		if(!_rootIndexObj[classId]){
			_rootIndexObj[classId]={}		
			_rootIndexObj[classId]['children']=[];
			_rootIndexObj[classId]['parents']=[];
			_rootIndexObj[classId]['allChildren']=[];
			_rootIndexObj[classId]['name']=classId;
			_rootIndexObj[classId]['id']=getId(classId);	
		}

		const label=getLabel(item,_rootIndexObj[classId]['id'])

			_rootIndexObj[classId]['abstract']=abstract;		
			_rootIndexObj[classId]['label']=label;
			_rootIndexObj[classId]['comment']=description;

			//add for children
			if(Array.isArray(item['Parents'])){
				const parentNum=item['Parents'].length;
				
				let isChildOFDocument=false;
				let isObjectParent=false;
				
				item['Parents'].forEach((parentId)=>{

					/*one node can be child of an Document and a Object Class
					* so the parents can have 2 different types
					*/
					

					if(parentId==='http://terminusdb.com/schema/system#Document'){
						_rootIndexObj[classId]['type']='Document';						
						/*only one parent and it is Document*/
						//isChildOFDocument=true;
						//if(parentNum===1){
						_rootIndexObj.DocumentClasses.children.push(_rootIndexObj[classId])
						//}
					
					}else if(_rootIndexObj[parentId] && _rootIndexObj[parentId]['type']){

						if(!_rootIndexObj[classId]['type']){
							_rootIndexObj[classId]['type']=_rootIndexObj[parentId].type;
						}
						if(_rootIndexObj[parentId].type===CLASS_TYPE_NAME.OBJECT_CLASS){
							isObjectParent=true;
						}
					}
				})

			}else{
				/*
				* if no parents can be or a first level Object class Type Or a Choice class type
				* check if it is a choiseClass
				* special class No properties no children
				*/
			 	checkOrdinaryClassType(_rootIndexObj[classId],item,_rootIndexObj);
			}

			//add for children
			if(Array.isArray(item['Children']) ){//&& classId==="terminusdb:///schema#Organization"){
				/*
				* I can't remove this node before move or remove all the children
				*/
				item['Children'].forEach((childId)=>{
					if(!_rootIndexObj[childId]){
						_rootIndexObj[childId]={}
						_rootIndexObj[childId]['name']=childId
						_rootIndexObj[childId]['id']=getId(childId)
						_rootIndexObj[childId]['children']=[]
						_rootIndexObj[childId]['allChildren']=[]
						_rootIndexObj[childId]['parents']=[]
						_rootIndexObj[childId]['type']=_rootIndexObj[classId].type;
					}else{
						/*
						* if exist I remove it from document group
						*/
						if(_rootIndexObj[childId].type===CLASS_TYPE_NAME.DOCUMENT_CLASS && _rootIndexObj[classId].type===CLASS_TYPE_NAME.DOCUMENT_CLASS){
							removeElementToArr(_rootIndexObj[CLASS_TYPE_NAME.DOCUMENT_CLASSES].children,childId);						 
						}
						
						/*
						* if it has multi parents type the node is always a document type
						* if child_type id undefined or object type
						*/
					
						if(_rootIndexObj[classId].type && _rootIndexObj[childId].type!==CLASS_TYPE_NAME.DOCUMENT_CLASS){
							_rootIndexObj[childId]['type']=_rootIndexObj[classId].type;
							
							/*
							* check the other levels of relationship  
							*/						
							checkChildrenType(_rootIndexObj[childId].children,_rootIndexObj[classId].type);
						}									
					}				

					//children property is for d3 hierarchy I add the node only at the first parent 
					if(_rootIndexObj[childId]['parents'].length===0){
						_rootIndexObj[classId]['children'].push(_rootIndexObj[childId])
					}
					// add child to the current node					
					_rootIndexObj[childId]['parents'].push(classId);
					_rootIndexObj[classId]['allChildren'].push(_rootIndexObj[childId])

				})
		//	}
		}
	})
}

function checkChildrenType(childrenElements,parentType){
	childrenElements.forEach((childrenEl)=>{
		childrenEl.type=parentType;
		checkChildrenType(childrenEl.children,parentType);
	})
}
/*
*the list of available parents depends on the type of node
*the list can not have the node currents parents or the currents children
*Object Class type can inherit only from Ordinary Classes 
*Document Class type can inherit from Ordinary Classes and Entity Classes
*/

export const availableParentsList = (classObj,objectTypeList,documentTypeList,_rootIndexObj)=>{
	const resultListObject={};
	resultListObject['documentClassArr']=[]	
	resultListObject['objectClassArr']=removeRelatedElements(classObj,objectTypeList,_rootIndexObj);
	if(classObj.type===CLASS_TYPE_NAME.DOCUMENT_CLASS)
		resultListObject['documentClassArr']=removeRelatedElements(classObj,documentTypeList,_rootIndexObj);
	return resultListObject;
}

const removeRelatedElements=(classObj,classesMap,_rootIndexObj)=>{
	if(classesMap.length===0)return [];

	const objectClassMap=classesMap.slice()

	removeElementToArr(objectClassMap,classObj.name);
	
	if(classObj.children && classObj.children.length>0){
		removeRelatedChildren(classObj.children,objectClassMap);
	}
	
	if(classObj.parents && classObj.parents.length>0)
		removeRelatedParent(classObj.parents,objectClassMap,_rootIndexObj)

	const classList=[]

	objectClassMap.forEach((elementName)=>{
		const elementObj=_rootIndexObj[elementName];
		const label=elementObj.label || elementObj.id
		classList.push({name:elementName,value:elementName,label:label })

	})
	
	return classList; //[...objectClassMap.values()]
}

/*
* recursive remove related parents
* parents=['parentName001','parentName002'...]
*/

const removeRelatedParent=(parentsList,classesMap,_rootIndexObj)=>{
	parentsList.forEach((parentName,key)=>{
		/*if(classesMap.has(parentName)){
			classesMap.delete(parentName)
		}*/
		removeElementToArr(classesMap,parentName);
		
		const parentObj=_rootIndexObj[parentName];
		removeRelatedParent(parentObj.parents,classesMap,_rootIndexObj);
	})
}

/*
* recursive remove related children
*/
const removeRelatedChildren=(childrenList,classList)=>{
	childrenList.forEach((childObj,key)=>{
		/*if(classList.has(childObj.name)){
			classList.delete(childObj.name)
		}*/
		removeElementToArr(classList,childObj.name)
		removeRelatedChildren(childObj.children,classList)
	})
}
