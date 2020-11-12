import React from 'react';
import {BaseLabelsElementViewMode} from './BaseLabelsElementViewMode'
import {GET_ICON_NAME,CARDINALITY_MIN_TITLE,CARDINALITY_MAX_TITLE,ELEMENT_BASE_CONST} from '../../../constants/details-labels';

export const BaseSchemaElementViewMode = (props)=>{

	let onClickEvent={}

	const currentNodeJson = props.currentNodeJson || {}

	const selectNode=()=>{
		props.changeCurrentNode(currentNodeJson.range,true)
	}

	const filterRangeValue=()=>{		
		let rangeStr=currentNodeJson.range;
		if(currentNodeJson.range.startsWith("terminusdb:///schema#")){
			const rangeArr=currentNodeJson.range.split('#');
			rangeStr=rangeArr[1];
			onClickEvent={onClick:selectNode}
		}

		return rangeStr;
	}

	const rangeValue=currentNodeJson.range ? filterRangeValue() : ''

	return(
		<div className="tdb__panel__box tdb__panel__box--hideEmpty">		 
			{currentNodeJson.abstract && <div className="tdb__panel__row">
				<i className="tdb__panel__title__icon custom-img-history" title="Abstract Class"></i>
			</div>}
			
			{currentNodeJson.id && <BaseLabelsElementViewMode label={ELEMENT_BASE_CONST.ID_TEXT} value={`scm:${currentNodeJson.id}`} />}

			{currentNodeJson.comment && <BaseLabelsElementViewMode label={ELEMENT_BASE_CONST.DESCRIPTION_TEXT} value={currentNodeJson.comment} />}			
			{currentNodeJson.min && <BaseLabelsElementViewMode label={CARDINALITY_MIN_TITLE} value={currentNodeJson.min} />}
			{currentNodeJson.max && <BaseLabelsElementViewMode label={CARDINALITY_MAX_TITLE} value={currentNodeJson.max} />}
			{currentNodeJson.range && 
				<BaseLabelsElementViewMode {...onClickEvent} label="Range Type" value={rangeValue} />
			}				
		</div>		
	)
}