import React, { useState } from 'react'
import {PROPERTY_TYPE_NAME,PROPERTY_TYPE_LABEL} from '../utils/elementsName'
import {GraphContextObj} from '../hook/graphObjectContext'
import {RelationshipView} from '../relationshipView/RelationshipView'

 
const constraintMessage={childrenNum:'This node has',
						inRelationship:'This node is in this Relationship',
						relComplexProperty:'This node is a range of the ComplexProperty'}

export const ConstraintsComponent =(props)=>{
    const [checked,setChecked] = useState({checked:false})

    const {selectedNodeObject,objPropsRelatedToClass,graphDataProvider} = GraphContextObj();

    const nodeData = selectedNodeObject ? selectedNodeObject : {}
    
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
//This node is connected to the Journey Document Type with the Property Bicycle Used
    	/*if(objPropsRelatedToClass && objPropsRelatedToClass.length>0){

    		const complexMessage= objPropsRelatedToClass.map((complexPropertyObj,index)=>{

                const propType=complexPropertyObj.type===PROPERTY_TYPE_NAME.CHOICE_PROPERTY 
                               ? PROPERTY_TYPE_LABEL.CHOICE_PROPERTY : PROPERTY_TYPE_LABEL.OBJECT_PROPERTY

                const domainElement=graphDataProvider.get(complexPropertyObj.domain) || {};
                const domainData=domainElement.data || {}

                return <div className="tdb__list__items"  key={'obj'+index} >
                            {`This node is connected to `} 
                            <b>{`${domainData.label || domainData.id} `}</b> 
                            <i>{`${domainData.type} Type `}</i>
                             with the <i>{` ${propType} `}</i> 
                            <b>{complexPropertyObj.label}</b>
                        </div>
            })

            message.push(<div className="tdb__list" key="object_property">
                           <div className="tdb__list__title">Property Relationship</div>
                           {complexMessage}
                        </div>)
    	}//*/

    	return message;
    }

	
    const message=getConstraintsMessage();

	return(<>
            <div className="tdb__panel__box">    
                <RelationshipView
                 />  
                {message}
            </div>
        </>
	)
}