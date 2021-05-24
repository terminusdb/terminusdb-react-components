import React,{useState} from 'react';
import {mainGraphDescriptionText,ELEMENT_DESCRIPTIONS} from '../../constants/details-labels';
import {GraphContextObj} from '../hook/graphObjectContext';
import {CLASS_TYPE_NAME_LABEL} from "../utils/elementsName";
import {BiNetworkChart} from "react-icons/bi"
import {AiOutlineNodeIndex} from "react-icons/ai"
import {MdCallSplit} from "react-icons/md"

export const InfoBoxComponent =(props)=> {

	const {mainGraphObj} = GraphContextObj();

	const elementsNumber=mainGraphObj ? mainGraphObj.getElementsNumber() : {}

	const propertiesNum=elementsNumber.properties || 0;
	const entitiesNum=elementsNumber.entities || 0;
	const ordinaryClassesNum=elementsNumber.classes || 0;
	const choiceClassesNum=elementsNumber.choiceClasses || 0

	if(props.custom) {
		return <div class="px-0 col-12 ml-3 mr-3 pr-3">
			<div class="shadow-sm card border-light">
				<div class="card-body">
					<h5>{props.dbName} - Schema</h5>
					<p>{mainGraphDescriptionText}</p>
					<div className="d-flex align-items-center justify-content-between border-bottom border-light pb-3 mt-3 mb-3">
						<div className="d-flex" title={ELEMENT_DESCRIPTIONS.Document}>
							<h6><BiNetworkChart className="schema-summary-icons"/> <strong className="ml-3">{CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES} </strong></h6>
						</div>
		                <div className="text-success fw-bold">
		                    {entitiesNum}
		                </div>
		            </div>

		            <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-3 mt-3 mb-3">
		                <div title={ELEMENT_DESCRIPTIONS.Properties} className="d-flex">
							<h6><AiOutlineNodeIndex className="schema-summary-icons"/> <strong className="ml-3">{(propertiesNum == 1 ? "Property" : "Properties")}</strong></h6>
		                </div>
		                <div className="text-success fw-bold">
		                        {propertiesNum}
		                </div>
		            </div>

					<div className="d-flex align-items-center justify-content-between border-bottom border-light pb-3 mt-3 mb-3">
		                <div title={ELEMENT_DESCRIPTIONS.ChoiceClass} className="d-flex">
							<h6><MdCallSplit className="schema-summary-icons"/> <strong className="ml-3">{CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES}</strong></h6>
		                </div>
		                <div className="text-success fw-bold">
		                        {choiceClassesNum}
		                </div>
		            </div>

				</div>
			</div>
		</div>
	}

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
