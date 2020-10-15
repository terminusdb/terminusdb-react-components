import React, { Component } from 'react'
import {BaseSelectComponent} from './BaseSelectComponent';
import {BasePropertyComponent} from './BasePropertyComponent';

import {NUMBER_PROPERTY_PRECISION_DATAPROVIDER,PRECISION_LABEL,NUMBER_TYPE_LABEL,
		NUMBER_PROPERTY_TYPE_DATAPROVIDER,NUMERIC_TYPE_ELEMENT_ID,PRECISION_ELEMENT_ID,} from '../../constants/details-labels.js';
//import { connect } from 'react-redux';
//import {CHANGE_DATA_VALUE_TO_MAIN_GRAPH} from '../../constants/MainGraphChangeActionTypes';


export const NumericProperty =(props)=>{

	//render(){
	const currentNodeJson=props.currentNodeJson || {}

	const defaultLabel=currentNodeJson.label || '';
	const defaultComment=currentNodeJson.comment || '';
	const defaultPrecision=currentNodeJson.value_type || '';
	const defaultNumberType=currentNodeJson.interpretation || '';
	const defaultUnits=currentNodeJson.units || ''; 

	const title=currentNodeJson.label

	const tooltip='tooltip';

	const inputClassName=props.inputClassName || "form-control";
	const groupClassName=props.groupClassName || "formItemGroup";
	const selectClassName=props.selectClassName || "form-control";

	const parentClassData={parentClassId:props.id, parentClassType:currentNodeJson.type} 
	const removeTitle=`Remove ${title}`

	return(
			<BasePropertyComponent {...props} >
					<BaseSelectComponent title={PRECISION_LABEL}
                    		dataProvider={NUMBER_PROPERTY_PRECISION_DATAPROVIDER}
                    		id={PRECISION_ELEMENT_ID}
                    		{...parentClassData} 
                       		defaultValue={defaultPrecision}
                       		optionChange={props.optionChange}/>

			</BasePropertyComponent>
	)
	//}
}