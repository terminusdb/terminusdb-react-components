import React,{useState}from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'; 

export const BaseSelectReactElement=(props)=>{
	
	const [selectedOption, setSelectedOption]=useState(props.defaultValue || {})

    const onChange=(selectedValue)=>{
    	//const currentValue=value.value || value.id;
    	if(selectedValue && selectedOption.value!==selectedValue.value){
    		//props.onChangeValue(selectedValue);
    		if(props.resetSelection){
    			setSelectedOption({});
    		}else{
    			setSelectedOption(selectedValue);
    		}
    				
    		props.optionChange(props.id,selectedValue.value);
    	}
    }

	
	const dataProvider=props.dataProvider || [];
	const groupClassName=props.groupClassName || "formItemGroup";
	const inputClassName=props.inputClassName || "form-control";
	const labelClassName=props.labelClassName || "formItemLabel"
	const title=props.title  || '';
	const isClearable=props.isClearable===false ? false : true
	const isDisabled=props.isDisabled ? true : false;
	let defaultValue={}



	return(
		 <div className={groupClassName}>
           	<label className={labelClassName} >{title}</label>
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
	  defaultValue :PropTypes.object.isRequired,
	  groupClassName:PropTypes.string,
	  inputClassName:PropTypes.string,
	  id:PropTypes.string.isRequired,
	  parentClassId:PropTypes.string.isRequired,
	  parentClassType:PropTypes.string.isRequired,
	  onChange:PropTypes.func.isRequired,
	  dataProvider:PropTypes.array,
	  placeholder:PropTypes.string
  }
