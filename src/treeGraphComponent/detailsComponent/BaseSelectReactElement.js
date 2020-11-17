import React,{useState,useEffect}from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'; 
import {HelpComponent} from './HelpComponent';

export const BaseSelectReactElement=(props)=>{
	
	const [selectedOption, setSelectedOption]=useState(props.defaultValue)

    const onChange=(selectedValue)=>{
    	if(!selectedOption || (selectedValue && selectedOption.value!==selectedValue.value)){
    		if(props.resetSelection){
    			setSelectedOption(null);
    		}else{
    			setSelectedOption(selectedValue);
    		}
    				
    		props.optionChange(props.name,selectedValue.value);
    	}
    }

    useEffect(() => {
    	const defVal=props.defaultValue || {}
        if(selectedOption && defVal.value!==selectedOption.value){
        	setSelectedOption(defVal)
        }
       
    },[props.defaultValue])

	const dataProvider=props.dataProvider || [];	
	const isClearable=props.isClearable===false ? false : true
	const isDisabled=props.isDisabled ? true : false;
//
  const value = selectedOption!==null ? {value:selectedOption} : {}
  const itemError = selectedOption===null ? props.itemError : ''

	return(
		 <div className={props.groupClassName}>
        <div className="tdb__form__help">
          <label className={props.labelClassName} >{props.title}</label>
          <HelpComponent text={props.help}/>
        </div>
		  	<Select  
          value={selectedOption}
			  	isClearable={isClearable} 
			  	onChange={onChange} 
			  	options={dataProvider}  
			  	placeholder={props.placeholder}
			  	isDisabled={isDisabled}/>
          <span className="tdb__form__error">{itemError}</span>
		 </div>

	)
}


 BaseSelectReactElement.propTypes = {
	  defaultValue :PropTypes.object,
	  groupClassName:PropTypes.string,
	  inputClassName:PropTypes.string,
	  name:PropTypes.string.isRequired,
	  optionChange:PropTypes.func.isRequired,
	  dataProvider:PropTypes.array,
	  placeholder:PropTypes.string
  }

 BaseSelectReactElement.defaultProps = {
      groupClassName:'tdb__form__group',
      labelClassName:'tdb__form__label',
      title:'',
      placeholder:'Select an Item',
      dataProvider:[]
}
