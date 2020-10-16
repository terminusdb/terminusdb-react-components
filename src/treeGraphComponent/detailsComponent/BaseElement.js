import React,{useState,useEffect} from 'react';
import {ELEMENT_BASE_CONST}  from '../../constants/details-labels.js';
import {RemoveElementComponent} from './RemoveElementComponent';
import PropTypes from "prop-types";
import {HelpComponent} from "./HelpComponent";
/*
* I change the value in the dataprovider but don't render
*/

export const BaseElement = ({nodeJsonData,updateValue,removeElement,parentClassId,isNodeObject,hasConstraints})=>{	
    const [values,changeStateValues]=useState({});

    const elementName=nodeJsonData && nodeJsonData.name ? nodeJsonData.name : null ;

    useEffect(() => {
        const startValue=nodeJsonData ? JSON.parse(JSON.stringify(nodeJsonData)) : {};
        changeStateValues(startValue)

    },[nodeJsonData])

    const changeValue=(evt)=>{
    	const name=evt.currentTarget.name;
    	const value=evt.currentTarget.value;

    	const currentValues=Object.assign({}, values);
    	currentValues[name]=value;

    	changeStateValues(currentValues);   	
    }

    const saveValue=(evt)=>{
    	const name=evt.currentTarget.name;
        const value=evt.currentTarget.value;
    	if(updateValue){
    		updateValue(name,value,values);
    	}
    }

    const disabled = values && values.newElement ? {} : {disabled:true}

    return(
   	    <div key="props.nodeJsonData.name" className="tdb__panel__box">
            {values.name}
            <RemoveElementComponent 
                hasConstraints={hasConstraints} 
                elementId={values.name}
                elementType={values.type}
                removeElement={removeElement}/>
       	    	{isNodeObject && 
       				<div className="tdb__form__group">
    				 	<div className="tdb__form__help">
                             <span>
                                <input name='abstract' checked={values.abstract || false} type="checkbox" className="tdb__form__check" onChange={changeValue} ></input>                       
    		                    <label className="tdb__form__label" htmlFor='abstract'>Abstract</label>
                             </span>
    		                 <HelpComponent/>
    	                </div>
                	</div>
                }
            <div className="tdb__form__group" >
	    		<input
	    			{...disabled}
	                name="id"
	                placeholder= {ELEMENT_BASE_CONST.ID_TEXT}
	                className = "tdb__form__element"
	                onChange={changeValue}
	                onBlur={saveValue}
	                value={values.id || ''}
	            />
	        </div>
	        <div className="tdb__form__group" >
            <input
                name="label"
                placeholder= {ELEMENT_BASE_CONST.LABEL_TEXT}
                className = "tdb__form__element"
                onChange={changeValue}
                onBlur={saveValue}
                value={values.label || ''}
               
            />
            </div>
            <textarea 
                name="comment"
                placeholder= {ELEMENT_BASE_CONST.DESCRIPTION_TEXT}
                className = "tdb__form__element"
                onChange={changeValue}
                onBlur={saveValue}
                value={values.comment || ''}
            />
    	</div>
    )
}

BaseElement.propTypes = {
    nodeJsonData:PropTypes.object,
    isNodeObject:PropTypes.bool,
    hasConstraints:PropTypes.bool
}

BaseElement.defaultProps = {
    nodeJsonData: {},
    isNodeObject:true,
    hasConstraints:false
};