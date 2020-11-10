import React from 'react';

export const BaseLabelsElementViewMode =(props)=> {

	const onClick=props.onClick ? {onClick:props.onClick} : {}
	const className = props.onClick ? "itemViewValue itemViewValueActive" : "itemViewValue"

	return(
		<div className="itemViewDetail">
			{props.label && <label className="itemViewLabel">{props.label}:</label>}
			<div className={className} {...onClick}>{props.value}</div>
		</div>
	)
}