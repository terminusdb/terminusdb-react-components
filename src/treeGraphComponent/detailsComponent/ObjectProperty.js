import React, { useState } from 'react'
import {BasePropertyComponent} from './BasePropertyComponent'; 
//import ParentsElementViewMode from './ParentsElementViewMode'
import {BaseSelectComponent} from './BaseSelectComponent';
import {BaseSelectReactElement} from './BaseSelectReactElement';
//import ChangeRangeToComplexClassHandler from '../../containers/ChangeRangeToComplexClassHandler'
//import { connect } from 'react-redux';
import {ELEMENT_BASE_CLASS_LIST,ELEMENT_ENTITY_LIST_ITEM} from '../../constants/details-labels';
//import {CHANGE_RANGE_TO_COMPLEX_CLASS,CHANGE_DATA_VALUE_TO_MAIN_GRAPH} from '../../constants/MainGraphChangeActionTypes'

export const ObjectProperty =(props)=>{
	
	const [classType,setClassType]=useState('')

	let currentNodeJson=props.currentNodeJson || {}
	const parentClassId=props.parentClassId;
	const id=props.id;
	const dataProvider=props.objectPropertyList || [];

	//const elementClassList=props.objectPropertyList || [];

	const getSelectedValue=()=>{
		if(currentNodeJson.range){
			const rangeValue = dataProvider.find(element => element.name === currentNodeJson.range);

			return {label:rangeValue.label,name:rangeValue.name,value:rangeValue.value}
		}

		return null;
	}

	
	const isDisabled=currentNodeJson.isRelatedWith || false;
	const defaultValue=getSelectedValue();

	const onChangeValue=(propName,newValue)=>{
		props.updateValue(propName,newValue,currentNodeJson);
	}
	/*
	* very Important the displayAll must be === false for complex property
	* because the complex property of an EntityClass can have
	* herself as range
	*/
	return(<BasePropertyComponent {...props} >
			<BaseSelectReactElement
				optionChange={onChangeValue}
				defaultValue={defaultValue} 
				isDisabled={isDisabled} 
				placeholder="Select a Class" 
				resetSelection={true} 
				dataProvider={dataProvider} id="range" parentClassId={parentClassId} />
		   </BasePropertyComponent>			
	)
}