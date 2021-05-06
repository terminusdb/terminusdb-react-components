import React, { useState } from 'react'
import {BasePropertyComponent} from './BasePropertyComponent'; 
import {BaseSelectReactElement} from './BaseSelectReactElement';
import {ELEMENT_BASE_CLASS_LIST,ELEMENT_ENTITY_LIST_ITEM} from '../../constants/details-labels';

export const ObjectProperty =(props)=>{
	let currentNodeJson=props.currentNodeJson || {}
	const id=props.id;
	const dataProvider=props.comboDataProvider || [];
	const errorMessage="Please select an element"

	const getSelectedValue=()=>{
		if(currentNodeJson.range){
			const rangeValue = dataProvider.find(element => element.name === currentNodeJson.range);
			if(rangeValue)return {label:rangeValue.label,name:rangeValue.name,value:rangeValue.value}
		}
		return null;
	}

	
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
				itemError={errorMessage}
				title={props.title}
				optionChange={onChangeValue}
				defaultValue={defaultValue}
				placeholder={props.placeholder} 
				resetSelection={false} 
				isClearable={false}
				dataProvider={dataProvider} name="range" />
		   </BasePropertyComponent>			
	)
}