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
			parents=parentElementArr.map((parentName,index)=>{
				const elementObj=graphDataProvider.get(parentName);
				const elementData=elementObj.data;
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

	let parentsElementArr=props.parentsElementArr || [];
	const parentsElements=getParentElement(parentsElementArr);

	return (<div>{parentsElements}</div>)
}
