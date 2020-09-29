import React,{useState} from 'react';
import PropTypes from "prop-types";

export const Accordion = (props) => {
  	   
    const [showBody,setShowBody] = useState(props.showBody || false);

    const openBody = ()=>{setShowBody(!showBody)};

    const itemClassName=`tdb__accordion ${props.className}`;
      
    const arrowClassName=`tdb__accordion__arrow ${props.arrowClassName}`;
     		
    const bodyClassName=!showBody || props.isDisabled===true ? "tdb__accordion__body tdb__accordion__body--hidden" : "tdb__accordion__body"
  
    const openIconClass=showBody ? `${arrowClassName} ${props.arrowOpenClassName}` :  `${arrowClassName} ${props.arrowCloseClassName}`
  		
    const titleClassName=`tdb__accordion__title ${props.titleClassName}`;
    const tooltip = props.tooltip ? {title:props.tooltip} :{}

    let onClick=props.isDisabled===true ? {style:{color:'#e0e0e0'}}: {onClick:openBody}      


		return (
	     <div className={itemClassName}>
            <div className={titleClassName} {...onClick} {...tooltip}>
               <div className="titleContent">
                    {props.leftIconClassName && 
                      <i className={`window-icon ${props.leftIconClassName}`}></i>}
                    <div>{props.title}</div> 
                </div>
                <span className={openIconClass} role="presentation"></span>                   
            </div>
            <div className={bodyClassName}>
               {props.children}
            </div>
        </div>
		)
}


Accordion.propTypes = {
    arrowOpenClassName:PropTypes.string,
    arrowCloseClassName:PropTypes.string,
    className:PropTypes.string,
    arrowClassName:PropTypes.string,
    titleClassName:PropTypes.string,
    title:PropTypes.string,
    leftIconClassName:PropTypes.string
}

Accordion.defaultProps = {
    arrowOpenClassName:'fa fa-caret-up',
    arrowCloseClassName:"fa fa-caret-down",
    title:'title',
    className:'',
    arrowClassName:'',
    titleClassName:'',
    leftIconClassName:''
};