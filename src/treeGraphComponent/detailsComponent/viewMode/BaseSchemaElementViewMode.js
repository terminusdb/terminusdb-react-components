import React from 'react';
import {BaseLabelsElementViewMode} from './BaseLabelsElementViewMode'
import {GET_ICON_NAME,CARDINALITY_MIN_TITLE,CARDINALITY_MAX_TITLE} from '../../../constants/details-labels';

export const BaseSchemaElementViewMode = (props)=>{
	return(
		<div className="tdb__panel__box tdb__panel__box--hideEmpty">		 
			{props.currentNodeJson.abstract && <div className="tdb__panel__row">
				<i className="tdb__panel__title__icon custom-img-history" title="Abstract Class"></i>
			</div>}

			{props.currentNodeJson.comment && <BaseLabelsElementViewMode value={props.currentNodeJson.comment} />}			
			{props.currentNodeJson.min && <BaseLabelsElementViewMode label={CARDINALITY_MIN_TITLE} value={props.currentNodeJson.min} />}
			{props.currentNodeJson.max && <BaseLabelsElementViewMode label={CARDINALITY_MAX_TITLE} value={props.currentNodeJson.max} />}
			{props.currentNodeJson.range && <BaseLabelsElementViewMode label="Range Type" value={props.currentNodeJson.range} />}				
		</div>		
	)
}