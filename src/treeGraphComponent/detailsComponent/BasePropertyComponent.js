import React,{Fragment} from 'react'
import {BaseElement} from './BaseElement';
import {Accordion} from '../../form/Accordion';
import {GET_ICON_NAME,CARDINALITY_MIN_TITLE,CARDINALITY_MAX_TITLE} from '../../constants/details-labels';
import {BaseSelectComponent} from './BaseSelectComponent';
import {BaseNumericInput} from './BaseNumericInput';
import PropTypes from "prop-types";
import {HelpComponent} from './HelpComponent';
import {BaseInputElement} from './BaseInputElement';

export const BasePropertyComponent = (props)=> {

		const currentNodeJson=props.currentNodeJson || {}
		let title=`${currentNodeJson.label || ''}`
		const viewBaseSchema=props.viewBaseSchema===false ? false : true;
		const showAllButton=props.showAllButton || {};
		const leftIconClassName=GET_ICON_NAME[currentNodeJson.type] || "custom-img-string"
		
		const changePropertyValue=(propName,propValue)=>{
			if(propName==='label'){
				title=propValue;
			}
			props.updateValue(propName,propValue,currentNodeJson)
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
								   />}
				<div className="tdb__panel__box">
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
	               	{props.showCardinality &&
	               		<Fragment>
	               			<BaseInputElement help="card_min" defaultValue={currentNodeJson.min || ''} name='min' title={CARDINALITY_MIN_TITLE} onBlur={changePropertyValue}/>
                			<BaseInputElement help="card_max" defaultValue={currentNodeJson.max || ''} name='max' title={CARDINALITY_MAX_TITLE} onBlur={changePropertyValue}/>
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