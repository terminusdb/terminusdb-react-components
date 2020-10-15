import React from 'react';

export default class BaseLabelsElementViewMode extends React.Component  {

	render(){

		return(
			<div className="itemViewDetail">
				{this.props.label && <label className="itemViewLabel">{this.props.label}:</label>}
				<div className="itemViewValue">{this.props.value}</div>
			</div>
		)

	}

}