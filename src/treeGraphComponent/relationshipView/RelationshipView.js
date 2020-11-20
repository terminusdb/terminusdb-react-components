import React  from 'react'
import {RelationshipBox} from './RelationshipBox'
import {GraphContextObj} from '../hook/graphObjectContext'
import {PROPERTY_TYPE_NAME,PROPERTY_TYPE_LABEL} from '../utils/elementsName'

export const RelationshipView = (props)=>{
	const {changeCurrentNode,
		  selectedNodeObject,
		  objPropsRelatedToClass,
		  mainGraphObj,nodePropertiesList} = GraphContextObj();

	/*
	* get all the relationship where the select node is a target
	*/
	const relObjArr= objPropsRelatedToClass.map((complexPropertyObj,index)=>{

            const propType=complexPropertyObj.type===PROPERTY_TYPE_NAME.CHOICE_PROPERTY 
                           ? PROPERTY_TYPE_LABEL.CHOICE_PROPERTY : PROPERTY_TYPE_LABEL.OBJECT_PROPERTY

            const domainData=mainGraphObj.getElement(complexPropertyObj.domain) || {};
            const label = complexPropertyObj.label || complexPropertyObj.id

            return <RelationshipBox source={domainData} 
            					sourceAction={changeCurrentNode}
	   	                        target={selectedNodeObject}
	   	                        label={label} 
	   	                        key={'rel__'+index}/>
	})

	/*
	* get all the relationship where the select node is a source
	*/
	const domainToProp=[]
	nodePropertiesList.forEach((propertyItem,index)=>{
		if(propertyItem.type===PROPERTY_TYPE_NAME.CHOICE_PROPERTY || 
		   propertyItem.type===PROPERTY_TYPE_NAME.OBJECT_PROPERTY){

           if(propertyItem.range){
           		const label = propertyItem.label || propertyItem.id
           		const rangeElement=mainGraphObj.getElement(propertyItem.range) 

		   		domainToProp.push(<RelationshipBox source={selectedNodeObject} 
            					targetAction={changeCurrentNode}
	   	                        target={rangeElement}
	   	                        label={label} 
	   	                        key={'dom__'+index}/>)
           }
           
		}
	})
		
	return(
		<div className="tdb__panel__box">
		   {relObjArr}
		   {domainToProp}
		</div>
	)
	
}