import React,{useState} from 'react';
//import { connect } from 'react-redux';
//import BaseObjectClassLayout from './BaseObjectClassLayout'
//import {MODEL_RIGHT_WINDOW_OBJ} from '../../constants/ObjectsName'
//import BaseSelectComponent from './BaseSelectComponent';
//import BaseSelectReactElement from './BaseSelectReactElement';
//import CONST from './const';
//import {clickTreeNode,focusOnNode} from '../../actions/treeModelActions'
import {mainGraphDescriptionText} from '../../constants/details-labels';

export const InfoBoxComponent =(props)=> {

	const [classType,setClassType]=useState()

	const filterList=(evt)=>{
		if(evt.currentTarget.value){
			setClassType(evt.currentTarget.value)
		}
	}

	const getClassDataProvider=()=>{
		let dataProvider=[];
		switch(this.state.classType){
			case 'EntityClass':
		        dataProvider=props.entitiesListArr;//.concat(props.ordinaryClassDataP)
				break;
		    case 'OrdinaryClass':
		    	  dataProvider=props.classesListArr;
		    	  break;
		}

		return dataProvider;
	}


	const elementsNumber=props.elementsNumber || {};

	const propertiesNum=elementsNumber.properties || 0;
	const entitiesNum=elementsNumber.entities || 0;
	const relationshipsNum=elementsNumber.relationships || 0;
	const ordinaryClassesNum=elementsNumber.classes || 0;

	//const elementClassList=CONST.ELEMENT_BASE_LIST;
	//const dataProvider=getClassDataProvider();

	return(
			<div className="tdb__panel">
				 <div className="tdb__panel__title">
				 	Main Graph
				 </div>
				 <div className="tdb__panel__box">
				 {mainGraphDescriptionText}
				</div>
				<div className="tdb__panel__box">
				 <div className="numElementMain">
				  	<div className="numElementBox">				  	
				  		<i className="window-icon custom-img-entities"></i>
				  	 	<div className="titleElement">Document {entitiesNum}</div>
				  	</div>
				  	<div className="numElementBox" >
				  		<i className="window-icon custom-img-classes"></i>
				  	 	<div className="titleElement">Classes {ordinaryClassesNum}</div>
				  	</div>
				   </div>
				   <div className="numElementMain">
				  	<div className="numElementBox">
				  		<i className="window-icon custom-img-view"></i>
				  	 	<div className="titleElement">Properties {propertiesNum}</div>
				  	</div>
				  	<div className="numElementBox" style={{visibility:'hidden'}}>
				  		<i className="window-icon custom-img-view"></i>
				  	 	<div className="titleElement">Properties {propertiesNum}</div>
				  	</div>
				 </div>
				</div>						
			</div>
	)
}

/*
<div className="itemBaseSchema">
							<BaseSelectComponent dataProvider={elementClassList} optionChange={this.filterList.bind(this)} showLabel={false} id='elementsType'/>						
							<BaseSelectReactElement resetSelection={true} isClearable={false} onChange={this.props.onChange} placeholder='Select an Element' dataProvider={dataProvider} />
					    </div>*/