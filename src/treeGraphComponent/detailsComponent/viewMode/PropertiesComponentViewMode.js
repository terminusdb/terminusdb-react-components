import React, { Component } from 'react'
import {BaseLabelsElementViewMode} from './BaseLabelsElementViewMode'
import {BaseSchemaElementViewMode} from './BaseSchemaElementViewMode'
import {Accordion} from '../../../form/Accordion';

//import {getRangeListPropertyLabel} from '../../utils/formatTreeModel';

//import CONST from './const.js';
//import {getLabelFromValue} from '../../utils/detailsFormatter'
//import ParentsElementViewMode from './ParentsElementViewMode'
import {GET_ICON_NAME,CARDINALITY_MIN_TITLE,CARDINALITY_MAX_TITLE} from '../../../constants/details-labels';

export const PropertiesComponentViewMode =(props)=> {

	/*const getExtraElement=(currentNodeJson)=>{

		switch(currentNodeJson.type){
		   		case 'ChoiceProperty':
		   			var choicesList=[];
		   			
		   			if(currentNodeJson.choices){

		   				for(let index in currentNodeJson.choices){
		   					const choiceItem=currentNodeJson.choices[index]
				  			choicesList.push(<div className="listItemText" title={choiceItem.comment || ''} key={'__choiceItem__'+index}>
				  			 					<p className="boldLabel">{choiceItem.label || choiceItem.name}</p> ({choiceItem.comment || ''})	  		
				  		  					</div>)
				  		}
		   			}
		   			return (
		   				<div className="listViewBox" >
			   				<div className="titleList">
					  			 {`${getRangeListPropertyLabel(currentNodeJson.range)} (List)`} 			  		
					  		 </div>		
		   					{choicesList}
		   				</div>);
		   			//return <ChoiceProperty id={propertyItem.schema_id} itemData={propertyItem}/>
		   		case 'NumericProperty':
		   			return(<div className="itemViewBox">
		   				{currentNodeJson.units && <BaseLabelsElementViewMode label={CONST.UNITS_LABEL} value={currentNodeJson.units} />}
		   				{currentNodeJson.value_type && <BaseLabelsElementViewMode label={CONST.PRECISION_LABEL} value={getLabelFromValue(CONST.NUMBER_PROPERTY_PRECISION_DATAPROVIDER,currentNodeJson.value_type)} />}
		   				{currentNodeJson.interpretation && <BaseLabelsElementViewMode label={CONST.NUMBER_TYPE_LABEL} value={getLabelFromValue(CONST.NUMBER_PROPERTY_TYPE_DATAPROVIDER,currentNodeJson.interpretation)} />}
		   				</div>
		   			)
		   			
	   		case 'StringProperty':
		   			return(<div className="itemViewBox">
		   				{currentNodeJson.value_type && <BaseLabelsElementViewMode label={CONST.STRING_TYPE_LABEL} value={getLabelFromValue(CONST.STRING_TYPE_DATAPROVIDER,currentNodeJson.value_type)} />}
		   				{currentNodeJson.string_min && <BaseLabelsElementViewMode label={CONST.MIN_LENGTH_LABEL} value={currentNodeJson.string_min} />}
		   				{currentNodeJson.string_max && <BaseLabelsElementViewMode label={CONST.MAX_LENGTH_LABEL} value={currentNodeJson.string_max} />}
		   				</div>
		   			)
		   		case 'GeoProperty':
		   			return (<div className="itemViewBox">
		   				{currentNodeJson.value_type && currentNodeJson.value_type.length>0 && 
		   							<BaseLabelsElementViewMode label={CONST.GEOMETRY_PROPS_DATAPROVIDER.label}
							 		value={getLabelFromValue(CONST.GEOMETRY_PROPS_DATAPROVIDER.options,currentNodeJson.value_type[0])}/>
							}
		   				</div>)
		   		case 'TemporalProperty':
		   			return (<div className="itemViewBox">
		   				{currentNodeJson.scoping && <BaseLabelsElementViewMode label={CONST.TEMPORAL_SCOPE_TYPE_DATAPROVIDER.label}
								value={getLabelFromValue(CONST.TEMPORAL_SCOPE_TYPE_DATAPROVIDER.options,currentNodeJson.scoping)} />}
						{currentNodeJson.granularity && <BaseLabelsElementViewMode label={CONST.TEMPORAL_GRANULARITY_DATAPROVIDER.label}
								value={getLabelFromValue(CONST.TEMPORAL_GRANULARITY_DATAPROVIDER.options,currentNodeJson.granularity)} />}							
		   				</div>)
		   		case 'ComplexProperty':
					 return (<div className="itemViewBox">
					            {currentNodeJson.rangeClass && <ParentsElementViewMode parentsElementArr={[currentNodeJson.rangeClass]} 
				  	                         treeModelGraph={props.treeModelGraph} title={'Parents'} />}
				  	        </div>)
		   		default:
		   			return '';

		}
	}*/

	const getPropertiesPanels=()=>{
		return dataProvider.map((propertyItem,index)=>{

			//const extraElements=getExtraElement(propertyItem);

			const title=propertyItem.label;

			//const leftIconClassName=CONST.GET_ICON_NAME[propertyItem.type];
			const leftIconClassName=GET_ICON_NAME[propertyItem.type] || "custom-img-string"

			return(	<Accordion showBody={props.showBody} 
					   arrowOpenClassName = "accordion__arrow fa fa-caret-up"
					   arrowCloseClassName = "accordion__arrow fa fa-caret-down"
					   title={title}
					   leftIconClassName={leftIconClassName}
					   tooltip={propertyItem.type || ''}>

					  <BaseSchemaElementViewMode currentNodeJson={propertyItem} />
					</Accordion>)
		});	
	}


	//render(){
	const dataProvider= props.dataProvider || [];
	const title='test';
	const tooltip='tooltip';

	const propertiesPanels=getPropertiesPanels();
	return(
        <div id="testID">
			{propertiesPanels}
	    </div>
	)
	//}
}