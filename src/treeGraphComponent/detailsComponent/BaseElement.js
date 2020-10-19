import React,{useState,useEffect} from 'react';
import {ELEMENT_BASE_CONST}  from '../../constants/details-labels.js';
import {RemoveElementComponent} from './RemoveElementComponent';
import PropTypes from "prop-types";
import {HelpComponent} from "./HelpComponent";
import {BaseInputElement} from './BaseInputElement';
import {BaseTextareaElement} from './BaseTextareaElement';
import {BaseCheckboxElement} from './BaseCheckboxElement';
/*
* I change the value in the dataprovider but don't render
*/

export const BaseElement = ({nodeJsonData,updateValue,removeElement,parentClassId,isNodeObject,hasConstraints})=>{	

    const changeElement=(name,value)=>{
        if(updateValue){
            updateValue(name,value,nodeJsonData);
        }
    }

    return(
   	    <div key={nodeJsonData.name} className="tdb__panel__box">
            {nodeJsonData.name}
            <RemoveElementComponent 
                hasConstraints={hasConstraints} 
                elementId={nodeJsonData.name}
                elementType={nodeJsonData.type}
                removeElement={removeElement}/>
       	    	{isNodeObject &&
                    <BaseCheckboxElement title={'Abstract'}  name='abstract' defaultValue={nodeJsonData.abstract || false} onBlur={changeElement} />
                }
                <BaseInputElement 
                    disabled={!nodeJsonData.newElement}
                    title={ELEMENT_BASE_CONST.ID_TEXT}
                    name='id'
                    onBlur={changeElement}
                    defaultValue={nodeJsonData.id || ''}
                    />
                <BaseInputElement 
                    title={ELEMENT_BASE_CONST.LABEL_TEXT}
                    name='label'
                    onBlur={changeElement}
                    defaultValue={nodeJsonData.label || ''}
                    />
            {/*<div className="tdb__form__group" >
	    		<input
	    			{...disabled}
	                name="id"
	                placeholder= {ELEMENT_BASE_CONST.ID_TEXT}
	                className = "tdb__form__element"
	                onChange={changeValue}
	                onBlur={saveValue}
	                value={values.id || ''}
	            />
	        </div>*/}
	         <BaseTextareaElement 
                    title={ELEMENT_BASE_CONST.DESCRIPTION_TEXT}
                    name='comment'
                    onBlur={changeElement}
                    defaultValue={nodeJsonData.comment || ''}
            />
            {/*<textarea 
                name="comment"
                placeholder= {ELEMENT_BASE_CONST.DESCRIPTION_TEXT}
                className = "tdb__form__element"
                onChange={changeValue}
                onBlur={saveValue}
                value={values.comment || ''}
            />*/}
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