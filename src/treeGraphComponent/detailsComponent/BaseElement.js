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

    const [indexError,setIndexError]=useState(false);

    const changeElement=(name,value)=>{
        if(name==="id"){

            if(value.indexOf(" ")>-1){
                setIndexError("Please remove all the white space");
                return;
            }
            if(value.trim()===""){
                setIndexError("Please enter a valid ID");
                return;
            }
            setIndexError(false);
        }
        if(updateValue){
            updateValue(name,value,nodeJsonData);
        }
    }

    useEffect(() => {
        setIndexError(false);
    },[nodeJsonData])

    return(
   	    <div className="tdb__panel__box">
            <RemoveElementComponent 
                hasConstraints={hasConstraints} 
                elementId={nodeJsonData.name}
                elementType={nodeJsonData.type}
                removeElement={removeElement}/>
       	    	{isNodeObject && nodeJsonData.type!=='ChoiceClass' && 
                    <BaseCheckboxElement title={'Abstract'}  name='abstract' defaultValue={nodeJsonData.abstract || false} onBlur={changeElement} />
                }
                <BaseInputElement
                    autoFocus={true} 
                    disabled={!nodeJsonData.newElement}
                    title={`${ELEMENT_BASE_CONST.ID_TEXT} *` }
                    placeholder={ELEMENT_BASE_CONST.ID_PLACEHOLDER}
                    name='id'
                    panelName={nodeJsonData.name}
                    onBlur={changeElement}
                    defaultValue={nodeJsonData.id || ''}
                    itemError={indexError}
                    />
                <BaseInputElement 
                    title={ELEMENT_BASE_CONST.LABEL_TEXT}
                    name='label'
                    placeholder={ELEMENT_BASE_CONST.LABEL_PLACEHOLDER}
                    onBlur={changeElement}
                    defaultValue={nodeJsonData.label || ''}
                    />
	         <BaseTextareaElement
                    placeholder={ELEMENT_BASE_CONST.DESCRIPTION_PLACEHOLDER} 
                    title={ELEMENT_BASE_CONST.DESCRIPTION_TEXT}
                    name='comment'
                    onBlur={changeElement}
                    defaultValue={nodeJsonData.comment || ''}
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