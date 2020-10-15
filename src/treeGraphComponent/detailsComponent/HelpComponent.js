import React from 'react';
import ReactTooltip from 'react-tooltip';

export const HelpComponent = (props) =>{

	const helpText=props.helpText || 'tooltip test';
	
	return(
	  <div className="icon-help">
	  	<i data-tip data-for='test' className="fas fa-info-circle"></i>
	  	<ReactTooltip id='test' type="warning" effect="solid">
	  	   <li>test test test</li>
	  	   <li>test test test</li>

	  	</ReactTooltip>
	  </div>
	)
}