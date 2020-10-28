import React, { useState } from 'react'
//import AccordionItemComponent from '../layoutComponent/AccordionItemComponent';
//import RelationshipBox from '../relationshipView/RelationshipBox'
import {PROPERTY_TYPE_NAME} from '../../constants/details-labels'
const constraintMessage={childrenNum:'This node has',
						inRelationship:'This node is in this Relationship',
						relComplexProperty:'This node is a range of the ComplexProperty'}

export const ConstraintsComponent =(props)=>{
    const [checked,setChecked] = useState({checked:false})
    const nodeData = props.nodeJsonData ? props.nodeJsonData : {}
    
    const change=(evt)=>{
       setChecked({checked:evt.target.checked});
    }
    //const elementLabel={}

    const getConstraintsMessage=()=>{
    	let message=[]

    	if(nodeData.children && nodeData.children.length>0){
            const childrenNum=nodeData.children.length;
            
    		const cName=childrenNum===1 ? 'child' : 'children';
    		const childrenMessage=`${childrenNum} direct ${cName}`
    		message.push(<div className="tdb__list" key='children'>
    						<div className="tdb__list__title">Children</div>
    						<div className="tdb__list__items">{childrenMessage}</div>
    					</div>)
    	}

    	if(props.objPropsRelatedToClass && props.objPropsRelatedToClass.length>0){
    		const complexMessage= props.objPropsRelatedToClass.map((complexPropertyObj,index)=>{
                        return <div className="tdb__list__items"  key={'obj'+index} >In this node the  
                                    <b> Property {complexPropertyObj.label} </b> is related with 
                                       the <b>{complexPropertyObj.classRangeType} {complexPropertyObj.classRangeLabel}</b>
                                </div>
            

            })

            message.push(<div className="tdb__list" key="object_property">
                           <div className="tdb__list__title">Object Property</div>
                           {complexMessage}
                        </div>)
    	}//*/

    	return message;
    }

	
    const message=getConstraintsMessage();

	return(<>
            <div className="tdb__panel__box">
			 	For removing a Node,
			 	the Node doesn't be related with other nodes.
			 	Here the list of contraints for the current node. 			 					
			</div>
            <div className="tdb__panel__box">
                {message}   
            </div>
        </>
	)
}