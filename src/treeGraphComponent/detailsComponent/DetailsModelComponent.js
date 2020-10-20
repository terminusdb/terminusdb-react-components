import React from 'react';
import PropTypes from "prop-types";
import {Accordion} from '../../form/Accordion'
import Tabs from 'react-responsive-tabs';
import {BaseElement} from './BaseElement';
import 'react-responsive-tabs/styles.css';
import {ConstraintsComponent} from './ConstraintsComponent';
import {ParentsFilter} from './ParentsFilter';
import {PropertiesComponent} from './PropertiesComponent';
import {ELEMENT_ICONS} from '../../constants/details-labels'
//ObjectClassModel
//properties
//node
//parents
//appearance
/*
add_quad("MyClass", "subClassOf", "Parent", "schema/main")
delete_quad("MyClass", "subClassOf", "Parent", "schema/main")
*/

export const DetailsModelComponent = (props)=>{

	const nodeData = props.currentNodeJson ? props.currentNodeJson : {}
	const objPropsRelatedToClass = props.objPropsRelatedToClass || []
	const childrenArr = nodeData.children || []
	const hasConstraints = (childrenArr.length>0 || objPropsRelatedToClass.length >0) ? true : false; 
	const imageType=ELEMENT_ICONS[nodeData.type]

	const getTabs=()=>{
		const tabsArr=[{title:'Class',
	             getContent: () =><div className="tdb__panel">
	             				   	<div className="tdb__panel__title">
							  	 		<i className={`tdb__panel__title__icon ${imageType}`}></i>
							  	 		{nodeData.id}
							  	 	</div>
	             					<BaseElement elementId={nodeData.name} elementType={nodeData.type} removeElement={props.removeElement} showCardinality={false} hasConstraints={hasConstraints} nodeJsonData={nodeData} updateValue={props.updateValue}/>
						 	 	</div>,				    
						    	key: 1,
						    	tabClassName: 'tab',
						    	panelClassName: 'tdb__panel--nopad'
							},
							{title:'Properties',
	             			getContent: () =>
	             				
	             					<PropertiesComponent removeElement={props.removeElement} 
		             					classPropertyList={props.classPropertyList}
		             					updateValue={props.updateValue}
		             					addNewProperty={props.addNewProperty}
		             					objectPropertyList={props.objectPropertyList}
	             					 />
	             				,
		
						    	key: 2,
						    	tabClassName: 'tab',
						    	panelClassName: 'tdb__panel'
						    },
						    {title:'Relationship',
	             			getContent: () =>
	             					<div className="tdb__panel">
	             						<ConstraintsComponent objectPropertyList={props.objectPropertyList} nodeJsonData={nodeData} objPropsRelatedToClass={props.objPropsRelatedToClass}/>
	             						<ParentsFilter availableParentsList={props.availableParentsList} nodeJsonData={nodeData} updateParentsList={props.updateParentsList}/>
	             				  	</div>,
		
						    	key: 3,
						    	tabClassName: 'tab',
						    	panelClassName: 'tdb__panel--nopad'
						    }]
		return tabsArr;
		} 

	return(
		<div className="tdb__sidebar" >
			<Tabs items={getTabs()} transform={false}/>
		</div>
	)
}

DetailsModelComponent.propTypes = {
    currentNodeJson:PropTypes.object,
}

DetailsModelComponent.defaultProps = {
    currentNodeJson: {}
};
