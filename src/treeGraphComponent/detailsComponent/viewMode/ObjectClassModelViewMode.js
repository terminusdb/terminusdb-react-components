import React,{Fragment} from 'react';
import {BaseSchemaElementViewMode} from './BaseSchemaElementViewMode'
import {PropertiesComponentViewMode} from './PropertiesComponentViewMode'
import {ParentsElementViewMode} from './ParentsElementViewMode'
import {CLASS_TYPE_NAME} from '../../utils/elementsName' 
import {ELEMENT_ICONS} from '../../../constants/details-labels'
import {ListComponent} from'../ListComponent';
import {GraphContextObj} from '../../hook/graphObjectContext';

export const ObjectClassModelViewMode = (props) => {

	const {selectedNodeObject,classPropertiesList,changeCurrentNode} = GraphContextObj();

	let currentNodeJson = selectedNodeObject || {};
	const imageType=ELEMENT_ICONS[currentNodeJson.type]

	let id =currentNodeJson.id;
	let nodeLabel =currentNodeJson.label;
	const propertiesDataProvider=[];//this.getPropertiesDataProvider(id) || [];

	//const members=currentNodeJson.members || {};	
	//const addRelationship = currentNodeJson.type==="Relationship" ? true : false;

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
		    {classPropertiesList && classPropertiesList.length>0 &&
			    <Fragment>
				    <div className="tdb__panel__title tdb__panel__title--prop">
			  	 		Property List
			  	 	</div>
					<PropertiesComponentViewMode changeCurrentNode={changeCurrentNode} dataProvider={classPropertiesList || []} />
				</Fragment>
			}
			{currentNodeJson.parents && currentNodeJson.parents.length>0 && 
				<Fragment>
					<div className="tdb__panel__title tdb__panel__title--parent">
		  	 		Parent List
		  	 		</div>
					<ParentsElementViewMode  id={props.id} title={'Parents'} />
				</Fragment>}		       
		</div>
	)
}