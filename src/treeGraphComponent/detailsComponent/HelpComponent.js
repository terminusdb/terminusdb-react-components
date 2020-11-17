import React from 'react';
import ReactTooltip from 'react-tooltip';
import {ELEMENT_HELP}  from '../../constants/details-labels.js';

export const HelpComponent = (props) =>{

	const helpText=props.helpText || 'tooltip test';
    
	return(
	  <div className="icon-help">
	  	<i data-tip data-for={props.text} className="fas fa-info-circle"></i>
	  	<ReactTooltip id={props.text} type="warning" effect="solid">
	  	   {ELEMENT_HELP[props.text]}
	  	</ReactTooltip>
	  </div>
	)
}