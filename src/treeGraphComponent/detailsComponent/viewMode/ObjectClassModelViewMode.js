import React from 'react';
import { connect } from 'react-redux';
import CONST from './const.js';
import BaseSchemaElementViewMode from './BaseSchemaElementViewMode'
import {getNodeDataProvider, getCurrentNode} from '../../utils/formatTreeModel'
import AccordionItemComponent from '../layoutComponent/AccordionItemComponent'
import PropertiesComponentViewMode from './PropertiesComponentViewMode'
import ParentsElementViewMode from './ParentsElementViewMode'
import BaseObjectClassLayout from './BaseObjectClassLayout'

import {MODEL_RIGHT_WINDOW_OBJ} from '../../constants/ObjectsName'
import BaseLabelsElementViewMode from './BaseLabelsElementViewMode'

//import RelationshipViewMode from './RelationshipViewMode'

import Tabs from 'react-responsive-tabs';
import 'react-responsive-tabs/styles.css';

export const ObjectClassModelViewMode = (props) => {


	getRelationshipElement(){
		const members=this.props.members || {};
		const relationship=[];
		for (let id in members){
			let item=members[id]
			relationship.push(<BaseLabelsElementViewMode label={item.label} value={item.elementLabel} />)
		   				
		}
		return relationship;
	}

	render(){
		let currentNodeJson = this.props.elementClassObj || {};
		let id =currentNodeJson.id;
		let nodeLabel =currentNodeJson.label;
		const propertiesDataProvider=[];//this.getPropertiesDataProvider(id) || [];

		const members=currentNodeJson.members || {};	
		const addRelationship = currentNodeJson.type==="Relationship" ? true : false;

		return(<BaseObjectClassLayout key={id} label={currentNodeJson.label} type={currentNodeJson.type} panelName={MODEL_RIGHT_WINDOW_OBJ}>
				 	<div className="flex_scroller_container">
					  	 <BaseSchemaElementViewMode  {...currentNodeJson.elementObj}  />
					  	 <PropertiesComponentViewMode dataProvider={currentNodeJson.propertyArray} id="test"/>
					  	 {currentNodeJson.parents.length>0 && <ParentsElementViewMode parentsElementArr={currentNodeJson.parentsObjAsArray()} 
					  	                       		id={this.props.id} title={'Parents'} />}
				  		 
				  		{addRelationship && 
			               <RelationshipViewMode source={currentNodeJson.source} target={currentNodeJson.target} id={this.props.id}/>
			            }
			        </div>
			  </BaseObjectClassLayout>
		)
	}
}

/*
<BaseObjectClassLayout key={id} label={nodeLabel} type={this.props.nodeType} panelName={MODEL_RIGHT_WINDOW_OBJ}>
				  	 <BaseSchemaElementViewMode {...currentNodeJson} />
				  	 {propertiesDataProvider.length>0 && <PropertiesComponentViewMode dataProvider={propertiesDataProvider} id="test"/> }
				  	 {this.props.parents && <ParentsElementViewMode parentsElementArr={this.props.parents} 
				  	                        treeModelGraph={this.props.treeModelGraph} id={id} title={'Parents'} />}
			  		 
			  		 {addRelationship && <RelationshipViewMode treeModelGraph={this.props.treeModelGraph} id={id} members={members} />}
			  </BaseObjectClassLayout>*/