import React,{useState,useEffect} from 'react';
import {ELEMENT_BASE_CONST, ELEMENT_HELP}  from '../../constants/details-labels.js';
import {RemoveElementComponent} from './RemoveElementComponent';
import PropTypes from "prop-types";
import {HelpComponent} from "./HelpComponent";
import {BaseInputElement} from './BaseInputElement';
import {BaseTextareaElement} from './BaseTextareaElement';
import {BaseCheckboxElement} from './BaseCheckboxElement';
/*
* I change the value in the dataprovider but don't render
*/

export const BaseElement = (props)=>{	

    const [indexError,setIndexError]=useState(false);
    const nodeJsonData=props.nodeJsonData || {}

    const changeElement=(name,value)=>{
        const trimValue=value.trim();
        if(name==="id"){           
            if(trimValue.indexOf(" ")>-1){
                setIndexError("Please remove all the white space");
                return;
            }
            if(trimValue===""){
                setIndexError("Please enter a valid ID");
                return;
            }
            setIndexError(false);
        }
        if(props.updateValue){
            props.updateValue(name,trimValue,nodeJsonData);
        }
    }

    useEffect(() => {
        setIndexError(false);
    },[nodeJsonData])

    return(
   	    <div className="tdb__panel__box">
            <RemoveElementComponent 
                hasConstraints={props.hasConstraints} 
                elementId={nodeJsonData.name}
                elementType={nodeJsonData.type}
                removeElement={props.removeElement}/>
       	    	{props.isNodeObject && nodeJsonData.type!=='ChoiceClass' && 
                    <BaseCheckboxElement title={'Abstract'} help={"abstract"} name='abstract' defaultValue={nodeJsonData.abstract || false} onBlur={changeElement} />
                }
                <BaseInputElement
                    autoFocus={true} 
                    disabled={!nodeJsonData.newElement}
                    title={`${ELEMENT_BASE_CONST.ID_TEXT} *` }
                    placeholder={ELEMENT_BASE_CONST.ID_PLACEHOLDER}
                    name='id'
                    panelName={nodeJsonData.name}
                    help={"class_id"}
                    onBlur={changeElement}
                    defaultValue={nodeJsonData.id || ''}
                    itemError={indexError}
                    />
                <BaseInputElement 
                    title={ELEMENT_BASE_CONST.LABEL_TEXT}
                    name='label'
                    placeholder={ELEMENT_BASE_CONST.LABEL_PLACEHOLDER}
                    help={"class_label"}
                    onBlur={changeElement}
                    defaultValue={nodeJsonData.label || ''}
                    />
                {props.children}
	            <BaseTextareaElement
                    placeholder={ELEMENT_BASE_CONST.DESCRIPTION_PLACEHOLDER} 
                    title={ELEMENT_BASE_CONST.DESCRIPTION_TEXT}
                    name='comment'
                    help={"class_comment"}
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