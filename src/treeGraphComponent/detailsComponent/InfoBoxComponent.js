import React,{useState} from 'react';
import {mainGraphDescriptionText,ELEMENT_DESCRIPTIONS} from '../../constants/details-labels';
import {GraphContextObj} from '../hook/graphObjectContext';
import {CLASS_TYPE_NAME_LABEL} from "../utils/elementsName";

export const InfoBoxComponent =(props)=> {

	const {mainGraphObj} = GraphContextObj();

	const elementsNumber=mainGraphObj ? mainGraphObj.getElementsNumber() : {}

	const propertiesNum=elementsNumber.properties || 0;
	const entitiesNum=elementsNumber.entities || 0;
	const ordinaryClassesNum=elementsNumber.classes || 0;
	const choiceClassesNum=elementsNumber.choiceClasses || 0
	return(
			<div className="RRT__container RRT__container--viewmode">
				 <div className="tdb__panel__title">
				 	{props.dbName} - Schema
				 </div>
				<div className="tdb_panel">
				 <div className="tdb__panel__box">
				 {mainGraphDescriptionText}
				 </div>
				<div className="tdb__panel__box">
				 <div className="numElementMain">
				  	<div className="numElementBox" title={ELEMENT_DESCRIPTIONS.Document}>				  	
				  		<i className="window-icon custom-img-entities"></i>
				  	 	<div className="titleElement">{`${entitiesNum} ${CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES}`}</div>
				  	</div>
				  	<div className="numElementBox" title={ELEMENT_DESCRIPTIONS.Class}>
				  		<i className="window-icon custom-img-classes"></i>
				  	 	<div className="titleElement">{`${ordinaryClassesNum} ${CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES}`}</div>
				  	</div>
				   </div>
				   <div className="numElementMain">				  	
				  	<div className="numElementBox" title={ELEMENT_DESCRIPTIONS.ChoiceClass}>
				  		<i className="window-icon custom-img-choice"></i>
				  	 	<div className="titleElement">{`${choiceClassesNum} ${CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES}`}</div>
				  	</div>
				  	<div className="numElementBox" title={ELEMENT_DESCRIPTIONS.Properties}>
				  		<i className="window-icon custom-img-view"></i>
				  	 	<div className="titleElement">{propertiesNum} {(propertiesNum == 1 ? "Property" : "Properties")}</div>
				  	</div>
				 </div>
				</div>
				</div>					
			</div>
	)
}