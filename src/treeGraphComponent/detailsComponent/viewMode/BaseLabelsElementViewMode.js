import React from 'react';

export const BaseLabelsElementViewMode =(props)=> {

	return(
		<div className="itemViewDetail">
			{props.label && <label className="itemViewLabel">{props.label}:</label>}
			<div className="itemViewValue">{props.value}</div>
		</div>
	)

}