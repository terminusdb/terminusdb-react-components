import React from 'react';
import {BaseSchemaElementViewMode} from './BaseSchemaElementViewMode'
import {PropertiesComponentViewMode} from './PropertiesComponentViewMode'
import {ParentsElementViewMode} from './ParentsElementViewMode'
import {ELEMENT_ICONS} from '../../../constants/details-labels'

export const ObjectClassModelViewMode = (props) => {


	/*getRelationshipElement(){
		const members=props.members || {};
		const relationship=[];
		for (let id in members){
			let item=members[id]
			relationship.push(<BaseLabelsElementViewMode label={item.label} value={item.elementLabel} />)
		   				
		}
		return relationship;
	}*/

	//render(){
	
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
			<PropertiesComponentViewMode dataProvider={props.classPropertyList || []} />
			{currentNodeJson.parents.length>0 && 
				<ParentsElementViewMode  id={props.id} title={'Parents'} />}		       
		</div>
	)
}

/*
	{/*	  	 {currentNodeJson.parents.length>0 && <ParentsElementViewMode parentsElementArr={currentNodeJson.parentsObjAsArray()} 
				  	                       		id={props.id} title={'Parents'} />}
			  		 
			  		{addRelationship && 
		               <RelationshipViewMode source={currentNodeJson.source} target={currentNodeJson.target} id={props.id}/>
		            }*/

/*
<BaseObjectClassLayout key={id} label={nodeLabel} type={props.nodeType} panelName={MODEL_RIGHT_WINDOW_OBJ}>
				  	 <BaseSchemaElementViewMode {...currentNodeJson} />
				  	 {propertiesDataProvider.length>0 && <PropertiesComponentViewMode dataProvider={propertiesDataProvider} id="test"/> }
				  	 {props.parents && <ParentsElementViewMode parentsElementArr={props.parents} 
				  	                        treeModelGraph={props.treeModelGraph} id={id} title={'Parents'} />}
			  		 
			  		 {addRelationship && <RelationshipViewMode treeModelGraph={props.treeModelGraph} id={id} members={members} />}
			  </BaseObjectClassLayout>*/