import React,{Fragment,useState} from 'react'
import {BaseElement} from './BaseElement';
import {Accordion} from '../../form/Accordion';
import {GET_ICON_NAME,CARDINALITY_MIN_TITLE,CARDINALITY_MAX_TITLE} from '../../constants/details-labels';
import {BaseSelectComponent} from './BaseSelectComponent';
import {BaseNumericInput} from './BaseNumericInput';
import PropTypes from "prop-types";
import {HelpComponent} from './HelpComponent';
import {BaseInputElement} from './BaseInputElement';

export const BasePropertyComponent = (props)=> {

		const [minError,setMinError] = useState('')
		const [maxError,setMaxError] = useState('')

		const currentNodeJson=props.currentNodeJson || {}
		let title=currentNodeJson.label || currentNodeJson.id
		const viewBaseSchema=props.viewBaseSchema===false ? false : true;
		const showAllButton=props.showAllButton || {};
		const leftIconClassName=GET_ICON_NAME[currentNodeJson.type] || "custom-img-string"
		
		const changePropertyValue=(propName,propValue)=>{
			if(propName==='label'){
				title=propValue;
			}
			props.updateValue(propName,propValue,currentNodeJson)
		} 
		
		const cardCheckValue=(propName,propValue)=>{
			if(propValue.trim()==='' || parseFloat(propValue)>0){
				if(propName==='min')setMinError("")
				if(propName==='max')setMaxError("")
				return true
			}
			if(propName==='min')setMinError("Please enter a valid number >0")
			if(propName==='max')setMaxError("Please enter a valid number >0")
			return false
		}

		return(
			<Accordion showBody={props.showBody} 
					   arrowOpenClassName = "accordion__arrow fa fa-caret-up"
					   arrowCloseClassName = "accordion__arrow fa fa-caret-down"
					   title={title}
					   leftIconClassName={leftIconClassName}
					   tooltip={currentNodeJson.type || ''}>
			
				{viewBaseSchema &&  <BaseElement updateValue={changePropertyValue}
										   removeElement={props.removeElement} 
										   nodeJsonData={currentNodeJson}
										   showAllButton={showAllButton}
										   isNodeObject={false}
								   >
								   {props.selectDataProvider &&
									<BaseSelectComponent
			                            help={props.help}
										optionChange={changePropertyValue}
			                            title={props.selectDataProvider.label}
					            		dataProvider={props.selectDataProvider.options}
					            		name={props.selectDataProvider.id}
					               		defaultValue={currentNodeJson.range || ''}
					               		/>
	               					}
	               					{props.children}
								   </BaseElement>}
				<div className="tdb__panel__box">	               
	               	{props.showCardinality &&
	               		<Fragment>
							<BaseInputElement itemError={minError} help="card_min" defaultValue={currentNodeJson.min || ''} name='min' title={CARDINALITY_MIN_TITLE} onBlur={changePropertyValue} checkValue={cardCheckValue}/>
                			<BaseInputElement itemError={maxError} help="card_max" defaultValue={currentNodeJson.max || ''} name='max' title={CARDINALITY_MAX_TITLE} onBlur={changePropertyValue} checkValue={cardCheckValue}/>
	               		</Fragment>
	               	}         					
				</div>
			</Accordion>
		)
}

BasePropertyComponent.propTypes = {
    showCardinality:PropTypes.bool
}

BasePropertyComponent.defaultProps = {
    showCardinality: true,
};