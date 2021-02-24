import React, {useState} from 'react'
import {BaseInputElement} from './BaseInputElement';
import {Accordion} from '../../form/Accordion';
import {ListComponent} from './ListComponent';
//import Select from 'react-select';
//import {ADD_NEW_CHOICE,REMOVE_CHOICE} from '../../constants/ActionTypes'

export const ChoiceList =(props)=> {
	const [choicesList,setChoiceList] =useState(props.choices || [])

	const [labelValue,setLabel]=useState('')
	const [commentValue,setComment]=useState('')
	const [idValue,setId]=useState('')

	const [idReqError,setIdReqError] =useState('')
	

	const addNewBox =()=>{
		if(!idValue){
			setIdReqError('This item is required')
		}else{
			const tmpList=choicesList.slice();		
			tmpList.push({label:labelValue,comment:commentValue,id:idValue});			
			//setItemData({label:'',comment:'',id:''})
			setComment("")
			setLabel("")
			setId("")
			
			setChoiceList(tmpList);
			if(props.updateChoiseList)props.updateChoiseList(tmpList)
		}
	}


	const removeChoice=(choiceName)=>{
		const index= choicesList.findIndex(x => x.id ===choiceName);
		const tmpList=choicesList.slice();
		tmpList.splice(index,1);
		setChoiceList(tmpList);
		if(props.updateChoiseList)props.updateChoiseList(tmpList)
	}

	const onBlur=(name,value)=>{		
		switch (name){
			case "comment":
				setComment(value)
				break;
			case "label":
				setLabel(value)
				break;
			case "id":
				const idval=value.trim();
				setId(idval)				
	            if(idval.indexOf(" ")>-1){
	                setIdReqError("Please remove all the white space");
	                return;
	            }
	            if(idval===""){
	                setIdReqError("Please enter a valid ID");
	                return;
	            }
				if(idval!=='')setIdReqError('')
				break
		}
	}

	const title='Values';
	const choiceTitle='Add a value'
	
	return(<>
		<div className="tdb__panel__box"> 
		  <span className="tdb__panel__subtitle">{title}</span>	  
		  <ListComponent dataProvider={choicesList} removeItem={removeChoice} />		 
		</div>
		<div className="tdb__panel__box" >		   
	   		<span className="tdb__panel__subtitle">New Value</span>		  		
  			<BaseInputElement help="choice_id" itemError={idReqError} title="ID" name="id"  onBlur={onBlur} defaultValue={idValue}/>
	  		<BaseInputElement help="choice_label" title="Label" name="label"  onBlur={onBlur} defaultValue={labelValue}/>
	  		<BaseInputElement help="choice_comment" title="Comment"  name="comment" onBlur={onBlur} defaultValue={commentValue}/>
	  		<button className="tdb__button__base tdb__button__base--green" onClick={addNewBox}>{choiceTitle}</button>  			  
		</div>
		</>
	)
}

//<Select onChange={this.onChangeSelection} isClearable={true} options={modelChoicesListValue} placeholder="Add a Choice"/>

