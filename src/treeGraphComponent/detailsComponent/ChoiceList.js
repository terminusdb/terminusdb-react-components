import React, {useState} from 'react'
import BaseInputElement from './BaseInputElement';
import Accordion from '../../form/Accordion';
//import Select from 'react-select';

import {ADD_NEW_CHOICE,REMOVE_CHOICE} from '../../constants/ActionTypes'

export const ChoiceList =(props)=> {
	const [choicesList,setChoiceList] =useState(props.choices || [])
	//const [itemData,setChoiceList] =useState(props.choices)
	
	const itemData={label:'',comment:''};


	const addNewBox =()=>{
		choiceList.push(itemData);
		props.updateChoiseList(choiceList)
	}


	const removeChoice(evt){
			if(evt.currentTarget.name){
				const index= choiceList.findIndex(evt.currentTarget.name);
				choiceList.slice(index,1);
				props.updateChoiseList(choiceList)	
			}
		}

		/*getRangeListPropertyLabel(currentNodeJson){
			if(currentNodeJson.range &&
			   currentNodeJson.range.length>0){
				const tmpArr=currentNodeJson.range[0].split("#")
				return tmpArr[1];
			}
		}*/

	/*const onChangeSelection(selectedOptions){
			props.onListChange({name:selectedOptions.value, label:selectedOptions.label, comment:selectedOptions.comment,
									 },'ADD_CHOICE')
		}*/

		const onBlur(name,value){
			itemData[name]=value;
		}

		const getChoicesListItem(){
			const choicesElement=[];
			choicesList.forEach((choiceItem,key)=>{
				choicesElement.push(
						<div key={'__choiceItem__'+choiceItem.id}>
			  			  <div className="propertyTitle">
			  			  <div title={choiceItem.comment || ''}>{choiceItem.label || choiceItem.id}</div>
			  			  		<button className="fa fa-minus buttonRemoveItem" name={choiceId} onClick={removeChoice}></button>
			  			  </div>
				  		</div>)
			}

			return choicesElement;
		}

/*
	border: 1px solid #265fa2;
    margin: 10px;
    padding: 10px;*/

		//render(){
		const title='Choices List';
		const tooltip='tooltip';

		const choiceTitle='Add a choice'
		const groupClassName=props.groupClassName || "formItemGroup"; 

		const currentNodeJson=props.currentNodeJson || {}

		//const defaultLabel=this.getRangeListPropertyLabel(currentNodeJson) || '';

		//this.modelChoicesList=props.modelChoicesList || {};

		const modelChoicesListValue=props.modelChoicesList || [];//Object.values(this.modelChoicesList);

		const id=props.id;

			//const title=`${defaultLabel || ''} (Choice List Property)`
			return(
				<Accordion className="accordion__body"
										titleClassName="accordion__title__details"
										arrowOpenClassName = "accordion__arrow fa fa-caret-up"
										arrowCloseClassName = "accordion__arrow fa fa-caret-down"
										title={title}
										leftIconClassName={false}
										tooltip={currentNodeJson.comment || ''}>

				<div className="itemBaseSchema">
				  
				  {this.getChoicesListItem()}
				  <div className="choiceBox" key={Date.now()}>
					  	<BaseInputElement title="Label" name="label"  onBlur={onBlur} defaultValue={itemData.label}/>
					  	<BaseInputElement title="Comment"  name="comment" onBlur={onBlur} defaultValue={itemData.comment}/>
					  	<button className="btn btn-outline-custom" onClick={addNewBox}>{choiceTitle}</button>
				    </div>
				</div>
				</Accordion>
			)
		//}
}

//<Select onChange={this.onChangeSelection} isClearable={true} options={modelChoicesListValue} placeholder="Add a Choice"/>

