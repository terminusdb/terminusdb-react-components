import React  from 'react'
import {BaseSelectComponent} from './BaseSelectComponent';
import {BasePropertyComponent} from './BasePropertyComponent';
import {STRING_TYPE_ELEMENT_ID,STRING_TYPE_DATAPROVIDER,STRING_TYPE_LABEL} from '../../constants/details-labels';

export const StringProperty = (props)=> {
	const currentNodeJson=props.currentNodeJson || {}
	const className=props.className || "form-control";
	const groupClassName=props.groupClassName || "formItemGroup";
	const id =props.id;
	const parentClassData={parentClassId:id, parentClassType:currentNodeJson.type} 
	
	return(
		<BasePropertyComponent {...props} >
			<BaseSelectComponent  title={STRING_TYPE_LABEL}
              		groupClassName={groupClassName} className={className}
            		dataProvider={STRING_TYPE_DATAPROVIDER}
            		id="range"
               		defaultValue={currentNodeJson.range || ''}
               		/>         
		</BasePropertyComponent>
	)
}
