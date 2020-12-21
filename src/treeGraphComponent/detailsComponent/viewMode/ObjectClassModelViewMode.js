import React,{Fragment} from 'react';
import {BaseSchemaElementViewMode} from './BaseSchemaElementViewMode'
import {PropertiesComponentViewMode} from './PropertiesComponentViewMode'
import {ParentsElementViewMode} from './ParentsElementViewMode'
import {CLASS_TYPE_NAME} from '../../utils/elementsName' 
import {ELEMENT_ICONS} from '../../../constants/details-labels'
import {ListComponent} from'../ListComponent'
import {GraphContextObj} from '../../hook/graphObjectContext'
import {ConstraintsComponent} from '../ConstraintsComponent'
import {RelationshipView} from '../../relationshipView/RelationshipView'

export const ObjectClassModelViewMode = (props) => {

	const {selectedNodeObject,
		   nodePropertiesList,
		   changeCurrentNode,mainGraphObj} = GraphContextObj();

	let currentNodeJson = selectedNodeObject || {};
	const imageType=ELEMENT_ICONS[currentNodeJson.type]

	const childrenArr=currentNodeJson.allChildren || []	

	let id =currentNodeJson.id;
	let label =currentNodeJson.label || currentNodeJson.id;
	const propertiesDataProvider=[];

	return(<div className="RRT__container RRT__container--viewmode" >
			<div className="tdb__panel__title">
	  	 		<i className={`tdb__panel__title__icon ${imageType}`}>
	  	 		</i>
	  	 		<p className="tdb__panel__label" title={label}> {label}</p>
	  	 	</div>
			<div className="tdb__panel">
			<BaseSchemaElementViewMode  currentNodeJson={currentNodeJson}  />
			{currentNodeJson.type===CLASS_TYPE_NAME.CHOICE_CLASS && 
			  <Fragment>
			  <span className="tdb__panel__title tdb__panel__title--parent">Values</span>
			  <div className="tdb__panel__box"> 
			  	<ListComponent dataProvider={currentNodeJson.choices} />		 
			  </div>
			  </Fragment>
		    }
		    {nodePropertiesList && nodePropertiesList.length>0 &&
			    <Fragment>
				    <div className="tdb__panel__title tdb__panel__title--prop">
			  	 		Properties
			  	 	</div>
					<PropertiesComponentViewMode mainGraphObj={mainGraphObj} changeCurrentNode={changeCurrentNode} dataProvider={nodePropertiesList || []} />
				</Fragment>
			}
			{currentNodeJson.parents && currentNodeJson.parents.length>0 && 
				<Fragment>
					<div className="tdb__panel__title tdb__panel__title--parent">
		  	 			Parent List
		  	 		</div>
					<ParentsElementViewMode  id={props.id} title={'Parents'} />
				</Fragment>}
			<Fragment>
				<div className="tdb__panel__title tdb__panel__title--prop">
	  	 		   Relationships
	  	 		</div>
				<ConstraintsComponent/>
			</Fragment>		
		</div>
		</div>
	)
}