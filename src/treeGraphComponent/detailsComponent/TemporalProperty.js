import React, { Component } from 'react'
import {TEMPORAL_GRANULARITY_DATAPROVIDER} from '../../constants/details-labels.js';
import {BaseSelectComponent} from './BaseSelectComponent';
import {BasePropertyComponent} from './BasePropertyComponent';

export const TemporalProperty = (props)=>{

	const currentNodeJson=props.currentNodeJson || {}

	const parentClassData={parentClassId:props.id, parentClassType:currentNodeJson.type} 
	const showAllButton={showTempButton:false,showGeoTempButton:false,showConfidenceButton:false};
	return(
			<BasePropertyComponent showAllButton={showAllButton} {...props}>					
									  
				<BaseSelectComponent title={TEMPORAL_GRANULARITY_DATAPROVIDER.label} 
								      defaultValue={currentNodeJson.range || ''} 
									  dataProvider={TEMPORAL_GRANULARITY_DATAPROVIDER.options}
									  {...parentClassData}
			 					  id={TEMPORAL_GRANULARITY_DATAPROVIDER.id}/>
			</BasePropertyComponent>			
		)
}