import React, {useState} from 'react'
import {BaseInputElement} from './BaseInputElement';
import {Accordion} from '../../form/Accordion';
import {ListComponent} from './ListComponent';
//import Select from 'react-select';
//import {ADD_NEW_CHOICE,REMOVE_CHOICE} from '../../constants/ActionTypes'

export const ChoiceList =(props)=> {
	const [choicesList,setChoiceList] =useState(props.choices || [])
	const [itemData, setItemData] = useState({label:'',comment:'',id:''})
	const [idReqError,setIdReqError] =useState('')
	
	//const itemData={label:'',comment:'',id:''};

	const addNewBox =()=>{
		if(!itemData.id){
			setIdReqError('This item is required')
		}else{
			const tmpList=choicesList.slice();		
			tmpList.push(itemData);
			setChoiceList(tmpList);
			setItemData({label:'',comment:'',id:''})
			if(props.updateChoiseList)props.updateChoiseList(tmpList)
		}
	}


	const removeChoice=(choiceName)=>{
		const index= choicesList.indexOf(choiceName);
		const tmpList=choicesList.slice();
		tmpList.splice(index,1);
		setChoiceList(tmpList);
		if(props.updateChoiseList)props.updateChoiseList(tmpList)
	}

	const onBlur=(name,value)=>{		
		itemData[name]=value;
		setItemData(itemData)
		if(name==="id" && value!=='')setIdReqError('');
	}

	const title='Choices List';
	const choiceTitle='Add a choice'
	
	return(<>
		<div className="tdb__panel__box">		   
	   		<span className="tdb__panel__subtitle">New Choice</span>		  		
  			<BaseInputElement itemError={idReqError} title="ID" name="id"  onBlur={onBlur} defaultValue={itemData.id}/>
	  		<BaseInputElement title="Label" name="label"  onBlur={onBlur} defaultValue={itemData.label}/>
	  		<BaseInputElement title="Comment"  name="comment" onBlur={onBlur} defaultValue={itemData.comment}/>
	  		<button className="tdb__button__base tdb__button__base--green" onClick={addNewBox}>{choiceTitle}</button>  			  
		</div>
		<div className="tdb__panel__box"> 
		  <span className="tdb__panel__subtitle">{title}</span>	  
		  <ListComponent dataProvider={choicesList} removeItem={removeChoice} />		 
		</div></>
	)
}

//<Select onChange={this.onChangeSelection} isClearable={true} options={modelChoicesListValue} placeholder="Add a Choice"/>

