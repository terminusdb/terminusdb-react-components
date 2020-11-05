import React from 'react';
import {BaseSchemaElementViewMode} from './BaseSchemaElementViewMode'
import {PropertiesComponentViewMode} from './PropertiesComponentViewMode'
import {ParentsElementViewMode} from './ParentsElementViewMode'
import {ELEMENT_ICONS,CLASS_TYPE_NAME} from '../../../constants/details-labels'
import {ListComponent} from'../ListComponent';
export const ObjectClassModelViewMode = (props) => {
	let currentNodeJson = props.currentNodeJson || {};
	const imageType=ELEMENT_ICONS[currentNodeJson.type]

	let id =currentNodeJson.id;
	let nodeLabel =currentNodeJson.label;
	const propertiesDataProvider=[];//this.getPropertiesDataProvider(id) || [];

	const members=currentNodeJson.members || {};	
	const addRelationship = currentNodeJson.type==="Relationship" ? true : false;

	return(<div className="tdb__panel">
		   	<div className="tdb__panel__title">
	  	 		<i className={`tdb__panel__title__icon ${imageType}`}></i>
	  	 		{currentNodeJson.label}
	  	 	</div>
			<BaseSchemaElementViewMode  currentNodeJson={currentNodeJson}  />
			{currentNodeJson.type===CLASS_TYPE_NAME.CHOICE_CLASS && 
			  <div className="tdb__panel__box"> 
			  	<span className="tdb__panel__subtitle">Choices List</span>	  
			  	<ListComponent dataProvider={currentNodeJson.choices} />		 
			  </div>
		    }			
			<PropertiesComponentViewMode dataProvider={props.classPropertyList || []} />
			{currentNodeJson.parents && currentNodeJson.parents.length>0 && 
				<ParentsElementViewMode  id={props.id} title={'Parents'} />}		       
		</div>
	)
}