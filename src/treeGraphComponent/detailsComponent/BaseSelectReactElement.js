import React,{useState}from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'; 

export const BaseSelectReactElement=(props)=>{
	
	const [selectedOption, setSelectedOption]=useState(props.defaultValue || {})

    const onChange=(selectedValue)=>{
    	if(selectedValue && selectedOption.value!==selectedValue.value){
    		//props.onChangeValue(selectedValue);
    		if(props.resetSelection){
    			setSelectedOption({});
    		}else{
    			setSelectedOption(selectedValue);
    		}
    				
    		props.optionChange(props.name,selectedValue.value);
    	}
    }

	const dataProvider=props.dataProvider || [];	
	const isClearable=props.isClearable===false ? false : true
	const isDisabled=props.isDisabled ? true : false;

	return(
		 <div className={props.groupClassName}>
           	<label className={props.labelClassName} >{props.title}</label>
		  	<Select value={selectedOption} 
			  	isClearable={isClearable} 
			  	onChange={onChange} 
			  	options={dataProvider}  
			  	placeholder={props.placeholder}
			  	isDisabled={isDisabled}/>
		 </div>

	)
}


 BaseSelectReactElement.propTypes = {
	  defaultValue :PropTypes.object,
	  groupClassName:PropTypes.string,
	  inputClassName:PropTypes.string,
	  name:PropTypes.string.isRequired,
	  onChange:PropTypes.func.isRequired,
	  dataProvider:PropTypes.array.isRequired,
	  placeholder:PropTypes.string
  }

 BaseSelectReactElement.defaultProps = {
      defaultValue :{},
      groupClassName:'tdb__form__group',
      labelClassName:'tdb__form__label',
      title:'',
      placeholder:'Select an Item'
}
