import React, { useState,Fragment } from 'react'
//import ChoiceProperty from './ChoiceProperty'
import {BasePropertyComponent} from './BasePropertyComponent'
import {ObjectProperty} from './ObjectProperty'
import {PropertyMenuList} from './PropertyMenuList'
import {STRING_TYPE_DATAPROVIDER,NUMBER_PROPERTY_PRECISION_DATAPROVIDER,
		GEOMETRY_PROPS_DATAPROVIDER,TEMPORAL_PROPERTY_DATAPROVIDER} from '../../constants/details-labels';

//import {PROPERTY_LIST_UPDATE} from '../../constants/MainGraphChangeActionTypes'

export const PropertiesComponent = (props)=> {

	const getPropertiesPanels=(dataProvider)=>{
		let showBody=true;
		/*
		*I open the first property
		*/
		return dataProvider.map((propertyItem,index)=>{

			if(index>0)showBody=false;

			const baseObj= {showBody:showBody,
				            parentClassId:props.id,
				            id:propertyItem.id,
				            currentNodeJson:propertyItem,
				            removeElement:props.removeElement,
				        	updateValue:props.updateValue
				        	}

			switch(propertyItem.type){
		   		//case 'ChoiceProperty':
		   			//return <ChoiceProperty {...baseObj} />
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
		   			//if(propertyItem.isRestrictionOf===null){
		   				//const availableComplexList=props.currentNodeJson.getAvailableComplexPList() || {};
		   				//parentClassType={props.currentNodeJson.type}
		   				baseObj['objectPropertyList']=props.objectPropertyList || [];

		   				return <ObjectProperty  {...baseObj} />;
	
		   			/*}else{
		   				const dataProvider=propertyItem.rangeRestrictionList();
		   				return <ComplexPropertyRestriction  dataProvider={dataProvider}
		   						{...baseObj} parentClassType={props.currentNodeJson.type}/>;
	
		   			}*/
		   			default:
		   			return '';
				}
		});	
	}

	//render(){
		const currentNodeJson=props.currentNodeJson || {};
		const dataProvider=props.classPropertyList || [];
		const title='test';
		const tooltip='tooltip';

		const mainGraphObj=currentNodeJson.mainGraphObj || {}

		/*
		*if no Ordinary classes Or entity class I can not create ComplexProperty
		*/
		/*if(mainGraphObj && mainGraphObj.complexPropertyIsActive()===false){
			/*
			*Disabled Complex Property from the list
			*/
			//propertyList.pop();
			//propertyList.push({label:'Complex Property', id:'ComplexProperty' , isDisabled:true });
		//}

		//const complexProRestriction=currentNodeJson.restrictionForComplexProperty() || {}
		//const restrictionDataP=Object.values(complexProRestriction);

		const propertiesPanels=getPropertiesPanels(dataProvider);

		return(
            <Fragment>
            	
            		 {/*restrictionDataP.length>0 && <PropertyMenuList buttonIconClassName="menuWithLabel"
								  iconClassName="fa fa-caret-down iconWithLabel" 
				                  dropdownMenuClassName="dropdownMenuProperty rightPosition" 
				                  label="Add Restiction To"
				                  actionName="ADD_PROPERTY_RESTRICTION"
				                  dataProvider={restrictionDataP} 
				                  panelId={props.id} 
				                  id={props.id}/>
				     */}
    		<PropertyMenuList buttonIconClassName="menuWithLabel"
						  iconClassName="fa fa-caret-down iconWithLabel" 
		                  dropdownMenuClassName="dropdownMenuProperty rightPosition" 
		                  addNewProperty={props.addNewProperty}/>
				     
            <div className="tdb__panel__box">
            	Too often huge amounts of data can’t answer the questions that actually matter. They deliver billions of isolated facts and zero intelligence. TerminusDB solves that problem.
            			
		    </div>
		    {propertiesPanels}
		    </Fragment>
		)
}
