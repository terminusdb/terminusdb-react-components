import React from 'react';
//import {schemaElementSelectOption} from '../../actions/graphActions';
//import {changeDataValueToMainGraph} from '../../actions/treeModelActions';
import PropTypes from 'prop-types'; 
import {HelpComponent} from './HelpComponent' 

export const BaseSelectComponent = (props) => {

	const defaultValue=props.defaultValue || '';

	const getDisabledOptions=(allowedValue,value)=>{
		if(!allowedValue || allowedValue==="ALL" || value==="")return {}
		if(allowedValue==="NONE") return {disabled:true};
		if(allowedValue && allowedValue===value)return {}
		return {disabled:true};
	}

	const getOptions=(dataProvider,comboId,defaultValue,allowedValue)=>{

		return dataProvider.map((comboData,index) =>{
			 const value=(typeof comboData ==='object') ? comboData.value : comboData //|| index;
			 const label=(typeof comboData ==='object') ? comboData.label : comboData //|| index;
			// const selected=defaultValue === value ? {'selected':true} : {} ;
			 const disabled=getDisabledOptions(allowedValue,value);
			// const 
       		 return( <option {...disabled} value={value} key={value +'__' + comboId + '__'+index}>{label}</option>)
      	})

	}

	const onChange=(evt)=>{
		const value=evt.currentTarget.value;
		props.optionChange(props.id,value);
	}



	//render(){
	const dataProvider=props.dataProvider || [];
	const comboId=props.id;
	//const className=props.className || "form-control";
	//const groupClassName=props.groupClassName || "formItemGroup";
	//const labelClassName=props.labelClassName || "form-label"
	//const parentComboId=props.parentId;
	const options=getOptions(dataProvider,comboId,props.defaultValue,props.allowedValue);
	
	const title=props.title || ''
	//const showLabel=props.showLabel

	const isDisabled=props.isDisabled ? {disabled:true} : {}
	//const addHelpComponent=props.addHelpComponent===true ? true : false;

	//const selErrorReporting=props.selErrorReporting || '';

	return(
		<div className={props.groupClassName}>
			<div className="tdb__form__help">
            	{props.showLabel && <label className={props.labelClassName} for={comboId}>{title}</label>}
	        	{props.addHelpComponent && <HelpComponent/> }
	        </div>
	        <div className="hideEmpty">
	        {props.selErrorReporting}
	        </div>
	        <select value={defaultValue} {...isDisabled} name={comboId} className={props.selectClassName} onChange={onChange.bind(this)}>
			  {options}
			</select>
        </div>
	)
	//}
}


BaseSelectComponent.propTypes = {
      defaultValue :PropTypes.string,
      groupClassName:PropTypes.string,
      selectClassName:PropTypes.string,
      labelClassName:PropTypes.string,
      id:PropTypes.string.isRequired,
      parentClassId:PropTypes.string.isRequired,
      parentClassType:PropTypes.string.isRequired,
      title:PropTypes.string,
      showLabel:PropTypes.bool,
      selErrorReporting:PropTypes.string,
      addHelpComponent:PropTypes.bool,
      dataProvider:PropTypes.array
}


BaseSelectComponent.defaultProps = {
      defaultValue :'',
      groupClassName:'tdb__form__group',
      selectClassName:'tdb__form__element',
      labelClassName:'tdb__form__label',
      title:'',
      showLabel:true,
      addHelpComponent:true,
      selErrorReporting:'',
      dataProvider:[]
}