import React from 'react';
import {BaseSchemaElementViewMode} from './BaseSchemaElementViewMode'
import {PropertiesComponentViewMode} from './PropertiesComponentViewMode'
import {Accordion} from '../../../form/Accordion'
import {GraphContextObj} from '../../hook/graphObjectContext';

export const ParentsElementViewMode =(props)=> {

	const {graphDataProvider,selectedNodeObject} = GraphContextObj()

	const getParentElement=()=>{
		const parentElementArr=selectedNodeObject.parents;

		let parents=[];

		const displayAll=props.displayAll===false ? false : true;

		if(parentElementArr){
			parents=parentElementArr.map((parentObj,index)=>{

				const elementObj=graphDataProvider.get(parentObj.name);
				const elementData=elementObj.data;
					//const currentNodeJson = props.currentNodeJson || {};

				//const parentsElements=this.getParentElement(elementData.parentsObjAsArray(),'Parent');
				//const schemaElementBowView = parentsElements.length===0 ? true : false;

				return ( <Accordion titleClassName="tdb__accordion__head--green"
									leftIconClassName = "custom-img-inherit-line"
									title={elementData.label}  
									tooltip={elementData.comment}>
					    	<BaseSchemaElementViewMode currentNodeJson={elementData} />					     	
					     </Accordion>)
			})
		}
		return parents;
	}
//{displayAll && parentsElements}

	//render(){
	let parentsElementArr=props.parentsElementArr || [];
	const parentsElements=getParentElement(parentsElementArr);

	return (<div>{parentsElements}</div>)
	//}

}

/*
{elementData.propertyArray.length>0 && displayAll && 
					    		<PropertiesComponentViewMode dataProvider={elementData.propertyArray} id="test"/> }
			  	*/