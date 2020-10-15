import React from 'react';
import CONST from './const.js';
//import BaseLabelsElementViewMode from './BaseLabelsElementViewMode'
import {getLabelFromValue} from '../../utils/detailsFormatter'

export const BaseSchemaElementViewMode = (props)=>{

	//render(){
	const lifespan=props.lifespan || {}
	const geolifespan=props.geolifespan || {}
    const lifespanTitle= props.lifespan ?`${CONST.TEMPORAL_SCOPE_TYPE_DATAPROVIDER.label}: ${getLabelFromValue(CONST.TEMPORAL_SCOPE_TYPE_DATAPROVIDER.options,lifespan.scoping)}` : '';

    const geoScopingTitle=geolifespan.scoping ? `Time: ${getLabelFromValue(CONST.TEMPORAL_SCOPE_TYPE_DATAPROVIDER.options,lifespan.scoping)}` : '';

    const geoTypeTitle=geolifespan.geotype ? `Geo Type: ${getLabelFromValue(CONST.GEOMETRY_PROPS_DATAPROVIDER.options,geolifespan.geotype)}` : ''; 
    
    const confidenceTitle=props.confidence ? `${CONST.CONFIDENCE_TITLE}: ${getLabelFromValue(CONST.CONFIDENCE_PROPS_DATAPROVIDER.options,props.confidence)}` : '';
	return(
		<div className="tdb__panel__box tdb__panel__box--hideEmpty">		 
			{props.abstract && <div className="tdb__panel__row">
				<i className="window-icon custom-img-history" title="Abstract Class"></i>
			</div>}

			{props.lifespan && 
				<div className="tdb__panel__row">
					<i className="window-icon custom-img-temporal" title={lifespanTitle}></i>
				</div>
		    }
		    {props.geolifespan && 
				<div className="tdb__panel__row">
					<i className="window-icon custom-img_map" title={`Location ${geoScopingTitle}  ${geoTypeTitle}`}></i>						
				</div>
			}
			{props.confidence && <div className="tdb__panel__row">
				<i className="window-icon custom-img-history" title={confidenceTitle}></i>
			</div>}
		
		{props.comment && <BaseLabelsElementViewMode value={props.comment} />}			
	</div>		
	)
//}
}