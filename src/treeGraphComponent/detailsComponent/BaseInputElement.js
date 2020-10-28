import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types'; 
import {HelpComponent} from './HelpComponent';
export const BaseInputElement = (props) => {

	const [value,setInputValue] = useState('')

	useEffect(() => {
        if(props.defaultValue!==value){
        	setInputValue(props.defaultValue)
        }
    },[props.defaultValue])
	
	const onBlur = (evt)=>{
		if(typeof props.onBlur ==='function')props.onBlur(props.name,value);
	}

	const onChange = (evt) =>{
		setInputValue(evt.currentTarget.value)
	}

	const disabled= props.disabled === true ? {disabled:true} : {}

	return(
			<div className={props.groupClassName}>
			 	<div className="tdb__form__help">
	                 <label className={props.labelClassName} for={props.name}>{props.title}</label>
	                 <HelpComponent/>
                </div>
                <input onBlur={onBlur} {...disabled} onChange={onChange} value={value} name={props.name} className={props.inputClassName}></input>       
            	<span>{props.itemError}</span>
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
	  name:PropTypes.string.isRequired,
	  onBlur:PropTypes.func,
	  disabled:PropTypes.bool
}

BaseInputElement.defaultProps = {
	  title:'',
	  defaultValue: '',
	  groupClassName:'tdb__form__group',
	  inputClassName:'tdb__form__element',
	  labelClassName:'tdb__form__label',
	  disabled:false
}
