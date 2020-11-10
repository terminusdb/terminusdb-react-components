export const PROPERTY_TYPE_NAME={
	STRING_PROPERTY:'StringProperty',
	NUMERIC_PROPERTY:'NumericProperty',
	CHOICE_PROPERTY:'ChoiceProperty',
	GEO_PROPERTY:'GeoProperty',
	TEMPORAL_PROPERTY:'TemporalProperty',
	OBJECT_PROPERTY:'ObjectProperty'
}

export const CLASS_TYPE_NAME={
	SCHEMA_ROOT: 'ROOT',
	SCHEMA_GROUP: 'Group',
  	OBJECT_CLASS:'Class',
  	CHOICE_CLASS:"ChoiceClass",
  	DOCUMENT_CLASS:"Document",
  	DOCUMENT_CLASSES:"DocumentClasses",
  	OBJECT_CLASSES:"OrdinaryClasses",
  	CHOICE_CLASSES:"ChoiceClasses"
}

export const CLASS_TYPE_NAME_LABEL={
	SCHEMA_ROOT:'Schema Graph',
	SCHEMA_GROUP: 'Group',
  	OBJECT_CLASS:'Object',
  	CHOICE_CLASS:"Choice",
  	DOCUMENT_CLASS:"Document",
  	DOCUMENT_CLASSES:"Document Type",
  	OBJECT_CLASSES:"Object Type",
  	CHOICE_CLASSES:"Choice Type"
}

export const getRootIndexObj=()=>{

	let _rootIndexObj= []

	_rootIndexObj[CLASS_TYPE_NAME.SCHEMA_ROOT]={name: CLASS_TYPE_NAME.SCHEMA_ROOT, 
												type: CLASS_TYPE_NAME.SCHEMA_ROOT, 
												label:CLASS_TYPE_NAME_LABEL.SCHEMA_ROOT, 
												children:[],
												comment:CLASS_TYPE_NAME_LABEL.SCHEMA_ROOT}

	_rootIndexObj[CLASS_TYPE_NAME.DOCUMENT_CLASSES]={name:CLASS_TYPE_NAME.DOCUMENT_CLASSES, 
												parents:[],
		                             			type:CLASS_TYPE_NAME.SCHEMA_GROUP,
		                             			label:CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES,
		                             			children:[],
		                             			comment:CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES}

	_rootIndexObj[CLASS_TYPE_NAME.OBJECT_CLASSES]={name:CLASS_TYPE_NAME.OBJECT_CLASSES, 
												parents:[],
		                             			type:CLASS_TYPE_NAME.SCHEMA_GROUP,
		                             			label:CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES,
		                             			children:[],
		                             			comment:CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES}
	
	_rootIndexObj[CLASS_TYPE_NAME.CHOICE_CLASSES]={name:CLASS_TYPE_NAME.CHOICE_CLASSES, 
												parents:[],
		                             			type:CLASS_TYPE_NAME.SCHEMA_GROUP,
		                             			label:CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES,
		                             			children:[],
		                             			comment:CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES}	
	return _rootIndexObj	                             			  

}
