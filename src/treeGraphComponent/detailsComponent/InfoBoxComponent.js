import React,{useState} from 'react';
import {mainGraphDescriptionText,ELEMENT_DESCRIPTIONS} from '../../constants/details-labels';
import {GraphContextObj} from '../hook/graphObjectContext';
import {CLASS_TYPE_NAME_LABEL} from "../utils/elementsName";

export const InfoBoxComponent =(props)=> {

	const [classType,setClassType]=useState()

	const {elementsNumber} = GraphContextObj();

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

	const propertiesNum=elementsNumber.properties || 0;
	const entitiesNum=elementsNumber.entities || 0;
	//const relationshipsNum=elementsNumber.relationships || 0;
	const ordinaryClassesNum=elementsNumber.classes || 0;
	const choiceClassesNum=elementsNumber.choiceClasses || 0
	return(
			<div className="tdb__panel">
				 <div className="tdb__panel__title">
				 	Schema - Type Hierarchy
				 </div>
				 <div className="tdb__panel__box">
				 {mainGraphDescriptionText}
				</div>
				<div className="tdb__panel__box">
				 <div className="numElementMain">
				  	<div className="numElementBox" title={ELEMENT_DESCRIPTIONS.Document}>				  	
				  		<i className="window-icon custom-img-entities"></i>
				  	 	<div className="titleElement">{`${entitiesNum} ${CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES}` + (entitiesNum == 1 ? "" : "s")}</div>
				  	</div>
				  	<div className="numElementBox" title={ELEMENT_DESCRIPTIONS.Class}>
				  		<i className="window-icon custom-img-classes"></i>
				  	 	<div className="titleElement">{`${ordinaryClassesNum} ${CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES}` + (ordinaryClassesNum == 1 ? "" : "s")}</div>
				  	</div>
				   </div>
				   <div className="numElementMain">				  	
				  	<div className="numElementBox" title={ELEMENT_DESCRIPTIONS.ChoiceClass}>
				  		<i className="window-icon custom-img-choice"></i>
				  	 	<div className="titleElement">{`${choiceClassesNum} ${CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES}`+ (choiceClassesNum == 1 ? "" : "s")}</div>
				  	</div>
				  	<div className="numElementBox" title={ELEMENT_DESCRIPTIONS.Properties}>
				  		<i className="window-icon custom-img-view"></i>
				  	 	<div className="titleElement">{propertiesNum} {(propertiesNum == 1 ? "Property" : "Properties")}</div>
				  	</div>
				 </div>
				</div>						
			</div>
	)
}