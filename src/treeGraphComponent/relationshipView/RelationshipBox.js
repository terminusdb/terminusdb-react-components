import React from 'react';
import {NodeRel} from './NodeRel';
import {RelationshipLine} from './RelationshipLine';

export const RelationshipBox =(props)=>{

	const source=props.source || {id:"Source",label:"NO Source"};
	const target=props.target || {id:"Target",label:"NO Target"};
	
		
	return(
			<div className="tdb__rel__box">
				 <NodeRel name={source.name}  label={source.label} onClick={props.sourceAction}/>
				 <RelationshipLine label={props.label || "Relationship"}/>
				 <NodeRel name={target.name}  label={target.label} onClick={props.targetAction}/>
        	</div>
		)
}