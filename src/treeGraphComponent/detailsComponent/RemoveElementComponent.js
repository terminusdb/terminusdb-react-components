import React from 'react';

export const RemoveElementComponent = (props) =>{

	const hasConstraints=props.hasConstraints;

	const tooltip=hasConstraints ? "This node cannot be removed" : `Remove the current ${props.nodeType}`;

  const onClick= hasConstraints===true ? {disabled:true} : {onClick:props.onClick}
  
		
  return(
         <div className="trashRow">                                
            <div className="icon-trash" {...disabled} title={tooltip}>
              <button {...onClick} className={props.className} title={props.tooltip}>{props.children}</button>                     
            </div>
         </div>
	)    
} 