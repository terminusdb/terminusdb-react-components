import React,{useState} from 'react';
import * as  LABELS from '../../constants/details-labels.js';
import {RemoveElementComponent} from './RemoveElementComponent';
/*
* I change the value in the dataprovider but don't render
*/

export const BaseElement = (props)=>{
	const [values,updateValues]=useState(props.currentNodeJson || {}); 

	/*const (e){
        if(e && e.target){
            setDeleteConfirm(e.target.value == meta.id)
        }
    }*/
    const changeValue=(evt)=>{
    	const name=evt.currentTarget.name;
    	const value=evt.currentTarget.value;

    	const currentValues=values || {};
    	currentValues[name]=value;

    	updateValue(values);

    	if(props.updateValue){
    		props.updateValue(name,value);
    	}
    }



    const groupClassName=props.groupClassName || "form-check-item";
	const inputClassName=props.inputClassName || "form-control";
	const labelClassName=props.labelClassName || "form-label"//"formItemLabel"
	const title=props.title  || '';

	const required = props.required === true ? "required" : "";


    return(
   	    <div className="tdb__panel__box">
   	    	{props.showAbstract && 
   				<div className={groupClassName}>
				 	<input name='abstract' checked={values.abstract || false} type="checkbox" className="form-check-input" onChange={changeValue} ></input>
				 	<div className="label-help">
		                 <label className={labelClassName} for='abstract'>{title}</label>
		                 <HelpComponent/>
	                </div>
            	</div>
            }
            <div className="tdb__form__group" >
	    		<input
	                name="id"
	                placeholder= {LABELS.DETAILS_ID}
	                className = "tdb__form__element"
	                onBlur={changeValue}
	                defaultValue={values.id || ''}
	            />
	        </div>
	        <div className="tdb__form__group" >
            <input
                name="label"
                placeholder= {LABELS.LABEL}
                className = "tdb__form__element"
                onBlur={changeValue}
                defaultValue={values.label || ''}
               
            />
            </div>
            <textarea 
                name="description"
                placeholder= {LABELS.DETAILS_LABEL}
                className = "tdb__form__element"
                onBlur={changeValue}
                defaultValue={values.description || ''}
            />
    	</div>
    )
}