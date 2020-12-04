import React, { useState,Fragment } from 'react'
import {BasePropertyComponent} from './BasePropertyComponent'
import {ObjectProperty} from './ObjectProperty'
import {PropertyMenuList} from './PropertyMenuList'
import {PROPERTY_TYPE_NAME,CLASS_TYPE_NAME_LABEL} from '../utils/elementsName'
import {STRING_TYPE_DATAPROVIDER,NUMBER_PROPERTY_PRECISION_DATAPROVIDER,
		GEOMETRY_PROPS_DATAPROVIDER,TEMPORAL_PROPERTY_DATAPROVIDER} from '../../constants/details-labels';

import {GraphContextObj} from '../hook/graphObjectContext';

export const PropertiesComponent = (props)=> {
	
	const {updateValue,
		  nodePropertiesList,
		  addNewProperty,
		  removeElement,
		  objectPropertyList,
		  objectChoicesList,
		  selectedNodeObject} = GraphContextObj();

	const enumDisabled=!objectChoicesList || objectChoicesList.length===0 ? true : false;

	const getPropertiesPanels=()=>{
		let showBody=true;
		/*
		*I open the first property
		*/
		return nodePropertiesList.map((propertyItem,index)=>{

			if(index>0)showBody=false;

			const baseObj= {showBody:showBody,
				            currentNodeJson:propertyItem,
				            removeElement:removeElement,
				        	updateValue:updateValue}

			switch(propertyItem.type){
		   		case PROPERTY_TYPE_NAME.CHOICE_PROPERTY:
		   			baseObj['showCardinality'] =false;
		   			baseObj['comboDataProvider']=objectChoicesList || [];
		   			baseObj['title']=`${CLASS_TYPE_NAME_LABEL.CHOICE_CLASS} Type *`
		   			baseObj['placeholder']=`Select ${CLASS_TYPE_NAME_LABEL.CHOICE_CLASS} Type`
		   			return <ObjectProperty  {...baseObj} key={propertyItem.name}/>;
		   		
		   		case PROPERTY_TYPE_NAME.NUMERIC_PROPERTY:
		   			baseObj['selectDataProvider']=NUMBER_PROPERTY_PRECISION_DATAPROVIDER;	
		   			return <BasePropertyComponent {...baseObj} key={propertyItem.name}/>

		   		case PROPERTY_TYPE_NAME.STRING_PROPERTY:
		   			baseObj['selectDataProvider']=STRING_TYPE_DATAPROVIDER;			   				   			
		   			return <BasePropertyComponent {...baseObj} key={propertyItem.name}/>

		   		case PROPERTY_TYPE_NAME.GEO_PROPERTY:
		   			baseObj['selectDataProvider']=GEOMETRY_PROPS_DATAPROVIDER;	
		   			return <BasePropertyComponent {...baseObj} key={propertyItem.name}/>
		   		case PROPERTY_TYPE_NAME.TEMPORAL_PROPERTY:

		   			baseObj['selectDataProvider']=TEMPORAL_PROPERTY_DATAPROVIDER;
		   			return <BasePropertyComponent {...baseObj}  key={propertyItem.name}/>
		   		case PROPERTY_TYPE_NAME.OBJECT_PROPERTY:
		   			baseObj['title']='Links To Type *'
		   			baseObj['placeholder']='Select Type'
		   			baseObj['comboDataProvider']=objectPropertyList || [];
		   			return <ObjectProperty  {...baseObj} key={propertyItem.name}/>;
		   			default:
		   				return '';
				}
		});	
	}
	const propertiesPanels=getPropertiesPanels(nodePropertiesList);
	return(
	    <Fragment>
	    	<PropertyMenuList enumDisabled={enumDisabled} 
	    				  buttonIconClassName="menuWithLabel"
						  iconClassName="fa fa-caret-down iconWithLabel" 
		                  dropdownMenuClassName="dropdownMenuProperty rightPosition" 
		                  addNewProperty={addNewProperty}/>				     
	    	{propertiesPanels}
	    </Fragment>
	)
}
