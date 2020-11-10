import React,{useState} from 'react';
import {mainGraphDescriptionText,ELEMENT_ICONS} from '../../constants/details-labels';
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
				 	Main Graph
				 </div>
				 <div className="tdb__panel__box">
				 {mainGraphDescriptionText}
				</div>
				<div className="tdb__panel__box">
				 <div className="numElementMain">
				  	<div className="numElementBox">				  	
				  		<i className="window-icon custom-img-entities"></i>
				  	 	<div className="titleElement">{`${CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES} ${entitiesNum}`}</div>
				  	</div>
				  	<div className="numElementBox" >
				  		<i className="window-icon custom-img-classes"></i>
				  	 	<div className="titleElement">{`${CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES} ${ordinaryClassesNum}`}</div>
				  	</div>
				   </div>
				   <div className="numElementMain">				  	
				  	<div className="numElementBox">
				  		<i className="window-icon custom-img-view"></i>
				  	 	<div className="titleElement">{`${CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES} ${choiceClassesNum}`}</div>
				  	</div>
				  	<div className="numElementBox">
				  		<i className="window-icon custom-img-view"></i>
				  	 	<div className="titleElement">Properties {propertiesNum}</div>
				  	</div>
				 </div>
				</div>						
			</div>
	)
}