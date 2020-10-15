import React, { Component } from 'react'
import {GEOMETRY_PROPS_DATAPROVIDER,GEO_PROPERTY_VALUE_ID} from '../../constants/details-labels';
import {BaseSelectComponent} from './BaseSelectComponent';
import {BasePropertyComponent} from './BasePropertyComponent';
//import { connect } from 'react-redux';
//import {CHANGE_DATA_VALUE_TO_MAIN_GRAPH} from '../../constants/MainGraphChangeActionTypes';

export const GeographicProperty = (props)=>{
	//render(){
		const currentNodeJson=props.currentNodeJson || {}	
		const id=props.id;

		const parentClassData={parentClassId:id, parentClassType:currentNodeJson.type} 
		const geoDefaultValue=(currentNodeJson.range && currentNodeJson.range>0) ? currentNodeJson.range[0] : ''

		const optionChange=(propValue)=>{
			props.updateValue('range',propValue,currentNodeJson)
		} 	

		return(
			<BasePropertyComponent {...props} showButtonBar={false}>										
					<BaseSelectComponent optionChange={optionChange}
									  title={GEOMETRY_PROPS_DATAPROVIDER.label} 
									  defaultValue={geoDefaultValue} 
									  dataProvider={GEOMETRY_PROPS_DATAPROVIDER.options}
									  {...parentClassData}
									  id="range"
									  />
			</BasePropertyComponent>
		)
	//}
}

/*const mapStateToProps = (state, ownProps) => {
   const mainGraphIsChanged = state.mainGraphIsChanged || {}
   const actionsObj=mainGraphIsChanged.actionsObj || {};
   let propertyUpdate;    
	if(actionsObj[CHANGE_DATA_VALUE_TO_MAIN_GRAPH] && 
	   actionsObj[CHANGE_DATA_VALUE_TO_MAIN_GRAPH][ownProps.id]){

	  	propertyUpdate=actionsObj[CHANGE_DATA_VALUE_TO_MAIN_GRAPH][ownProps.id].lastUpdated;
	}

    return {propertyUpdate};
}

export default connect(
  mapStateToProps
)(GeographicProperty)*/
