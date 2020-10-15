import React, {useState} from 'react';
import PropTypes from 'prop-types'; 
import {HelpComponent} from './HelpComponent';
export const BaseInputElement = (props) => {
	
	const [value,setInputValue] = useState(props.defaultValue)
	
	const onBlur = (evt)=>{
		/*
		* if the value is different from the default ()
		*/
		//if(evt.target.value!==props.defaultValue){
		if(typeof props.onBlur ==='function')props.onBlur(props.id,value);			
		//}
	}

	const onChange = (evt) =>{
		setInputValue(evt.target.value)
	}


	return(
			 <div className={props.groupClassName}>
			 	<div className="label-help">
	                 <label className={props.labelClassName} for={props.id}>{props.title}</label>
	                 <HelpComponent/>
                </div>
                <input onBlur={onBlur} onChange={onChange} value={value} id={props.id} className={props.inputClassName}></input>       
            </div>

	)
}
//pattern="[0-9]{4}" required
BaseInputElement.propTypes = {
	  title:PropTypes.string,
	  defaultValue :PropTypes.string,
	  groupClassName:PropTypes.string,
	  inputClassName:PropTypes.string,
	  labelClassName:PropTypes.string,
	  id:PropTypes.string.isRequired,
	  onBlur:PropTypes.func
}

BaseInputElement.defaultProps = {
	  title:'',
	  defaultValue: '',
	  groupClassName:'tdb__form__group',
	  inputClassName:'tdb__form__element',
	  labelClassName:'tdb__form__label',
	  id:PropTypes.string.isRequired,
	  onBlur:PropTypes.func
}
