import React, { Component } from 'react'
import {BaseLabelsElementViewMode} from './BaseLabelsElementViewMode'
import {BaseSchemaElementViewMode} from './BaseSchemaElementViewMode'
import {Accordion} from '../../../form/Accordion';
import {PROPERTY_TYPE_NAME,GET_ICON_NAME,CARDINALITY_MIN_TITLE,CARDINALITY_MAX_TITLE} from '../../../constants/details-labels';
import {ListComponent} from '../ListComponent'
export const PropertiesComponentViewMode =(props)=> {
	const getPropertiesPanels=()=>{
		return dataProvider.map((propertyItem,index)=>{

			const title=propertyItem.label;

			//const leftIconClassName=CONST.GET_ICON_NAME[propertyItem.type];
			const leftIconClassName=GET_ICON_NAME[propertyItem.type] || "custom-img-string"

			return(	<Accordion showBody={props.showBody} 
					   arrowOpenClassName = "accordion__arrow fa fa-caret-up"
					   arrowCloseClassName = "accordion__arrow fa fa-caret-down"
					   title={title}
					   leftIconClassName={leftIconClassName}
					   tooltip={propertyItem.type || ''}>

					  <BaseSchemaElementViewMode currentNodeJson={propertyItem} />
					</Accordion>)
		});	
	}


	//render(){
	const dataProvider= props.dataProvider || [];
	const title='test';
	const tooltip='tooltip';

	const propertiesPanels=getPropertiesPanels();
	return(
        <div id="testID">
			{propertiesPanels}
	    </div>
	)
	//}
}