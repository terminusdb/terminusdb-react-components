import React from 'react';

export const BaseLabelsElementViewMode =(props)=> {

	const onClick=props.onClick ? {onClick:props.onClick} : {}
	const className = props.onClick ? "tdb__panel__viewvalue tdb__panel__viewvalue--active" : "tdb__panel__viewvalue"

	return(
		<div className="tdb__panel__row tdb__panel__row--center">
			{props.label && <label className="tdb__panel__viewlabel">{props.label}:</label>}
			<div className={className} {...onClick}>{props.value}</div>
		</div>
	)
}