import React, { useState,Fragment } from 'react'
import {BasePropertyComponent} from './BasePropertyComponent'
import {ObjectProperty} from './ObjectProperty'
import {PropertyMenuList} from './PropertyMenuList'
import {STRING_TYPE_DATAPROVIDER,NUMBER_PROPERTY_PRECISION_DATAPROVIDER,
		GEOMETRY_PROPS_DATAPROVIDER,TEMPORAL_PROPERTY_DATAPROVIDER} from '../../constants/details-labels';

import {GraphContextObj} from '../hook/graphObjectContext';

export const PropertiesComponent = (props)=> {
	
	const {updateValue,
		  classPropertiesList,
		  addNewProperty,
		  removeElement,
		  objectPropertyList,
		  objectChoicesList,
		  selectedNodeObject} = GraphContextObj();

	const getPropertiesPanels=()=>{
		let showBody=true;
		/*
		*I open the first property
		*/
		return classPropertiesList.map((propertyItem,index)=>{

			if(index>0)showBody=false;

			const baseObj= {showBody:showBody,
				            currentNodeJson:propertyItem,
				            removeElement:removeElement,
				        	updateValue:updateValue}

			switch(propertyItem.type){
		   		case 'ChoiceProperty':
		   			baseObj['showCardinality'] =false;
		   			baseObj['comboDataProvider']=objectChoicesList || [];

		   			return <ObjectProperty  {...baseObj} />;
		   		case 'NumericProperty':
		   			baseObj['selectDataProvider']=NUMBER_PROPERTY_PRECISION_DATAPROVIDER;	
		   			return <BasePropertyComponent {...baseObj} />

		   		case 'StringProperty':
		   			baseObj['selectDataProvider']=STRING_TYPE_DATAPROVIDER;			   				   			
		   			return <BasePropertyComponent {...baseObj} />

		   		case 'GeoProperty':
		   			baseObj['selectDataProvider']=GEOMETRY_PROPS_DATAPROVIDER;	
		   			return <BasePropertyComponent {...baseObj} />
		   		case 'TemporalProperty':

		   			baseObj['selectDataProvider']=TEMPORAL_PROPERTY_DATAPROVIDER;
		   			return <BasePropertyComponent {...baseObj} />
		   		case 'ObjectProperty':
		   				baseObj['comboDataProvider']=objectPropertyList || [];

		   				return <ObjectProperty  {...baseObj} />;
		   			default:
		   			return '';
				}
		});	
	}
	const propertiesPanels=getPropertiesPanels(classPropertiesList);
	return(
	    <Fragment>
	    	<PropertyMenuList buttonIconClassName="menuWithLabel"
						  iconClassName="fa fa-caret-down iconWithLabel" 
		                  dropdownMenuClassName="dropdownMenuProperty rightPosition" 
		                  addNewProperty={addNewProperty}/>
				     
	        <div className="tdb__panel__box">
	        	Too often huge amounts of data can’t answer the questions that actually matter. They deliver billions of isolated facts and zero intelligence. TerminusDB solves that problem.	        			
		    </div>
	    	{propertiesPanels}
	    </Fragment>
	)
}
