import React from 'react';
import ReactTooltip from 'react-tooltip';
import {ELEMENT_HELP}  from '../../constants/details-labels.js';
import { FaInfoCircle } from "react-icons/fa";

export const HelpComponent = (props) =>{

	const helpText=props.helpText || 'tooltip test';
    
	return(
	  <div className="icon-help">
	  	<FaInfoCircle data-tip data-for={props.text} ></FaInfoCircle>
	  	<ReactTooltip textColor="#24292e" id={props.text} type="warning" effect="solid">
	  	   {ELEMENT_HELP[props.text]}
	  	</ReactTooltip>
	  </div>
	)
}