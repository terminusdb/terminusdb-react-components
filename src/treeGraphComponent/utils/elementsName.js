export const PROPERTY_TYPE_NAME={
	STRING_PROPERTY:'StringProperty',
	NUMERIC_PROPERTY:'NumericProperty',
	CHOICE_PROPERTY:'ChoiceProperty',
	GEO_PROPERTY:'GeoProperty',
	TEMPORAL_PROPERTY:'TemporalProperty',
	OBJECT_PROPERTY:'LinkProperty'
}

export const getLabelByName=(elementName)=>{
	switch(elementName){
		case CLASS_TYPE_NAME.DOCUMENT_CLASS:
			return CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASS
		case CLASS_TYPE_NAME.OBJECT_CLASS:
			return CLASS_TYPE_NAME_LABEL.OBJECT_CLASS
		case CLASS_TYPE_NAME.CHOICE_CLASS:
			return CLASS_TYPE_NAME_LABEL.CHOICE_CLASS
		case CLASS_TYPE_NAME.OBJECT_CLASSES:
			return CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES
		case CLASS_TYPE_NAME.DOCUMENT_CLASSES:
			return CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES
	}
}

export const PROPERTY_TYPE_LABEL={
	STRING_PROPERTY:'String Property',
	NUMERIC_PROPERTY:'Numeric Property',
	CHOICE_PROPERTY:'Enum Property',
	GEO_PROPERTY:'Geo Property',
	TEMPORAL_PROPERTY:'Temporal Property',
	OBJECT_PROPERTY:'Link Property'
}

export const CLASS_TYPE_NAME={
	SCHEMA_ROOT: 'ROOT',
	SCHEMA_GROUP: 'Group',
  	OBJECT_CLASS:'Object',
  	CHOICE_CLASS:"ChoiceClass",
  	DOCUMENT_CLASS:"Document",
  	DOCUMENT_CLASSES:"DocumentClasses",
  	OBJECT_CLASSES:"ObjectClasses",
  	CHOICE_CLASSES:"ChoiceClasses"
}

export const CLASS_TYPE_NAME_LABEL={
	SCHEMA_ROOT:'Schema',
	SCHEMA_GROUP: 'Group',
  	OBJECT_CLASS:'Object',
  	CHOICE_CLASS:"Enum",
  	DOCUMENT_CLASS:"Document",
  	DOCUMENT_CLASSES:"Documents",
  	OBJECT_CLASSES:"Objects ",
  	CHOICE_CLASSES:"Enums"
}

export const getRootIndexObj=(dbName)=>{

	let _rootIndexObj= []

	_rootIndexObj[CLASS_TYPE_NAME.SCHEMA_ROOT]={name: CLASS_TYPE_NAME.SCHEMA_ROOT, 
												type: CLASS_TYPE_NAME.SCHEMA_ROOT, 
												label:`${dbName} ${CLASS_TYPE_NAME_LABEL.SCHEMA_ROOT}`, 
												children:[],
												comment:CLASS_TYPE_NAME_LABEL.SCHEMA_ROOT}

	
	_rootIndexObj[CLASS_TYPE_NAME.OBJECT_CLASSES]={name:CLASS_TYPE_NAME.OBJECT_CLASSES, 
												parents:[],										
		                             			type:CLASS_TYPE_NAME.SCHEMA_GROUP,
		                             			label:CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES,
		                             			children:[],
		                             			comment:CLASS_TYPE_NAME_LABEL.OBJECT_CLASSES}
	
    _rootIndexObj[CLASS_TYPE_NAME.DOCUMENT_CLASSES]={name:CLASS_TYPE_NAME.DOCUMENT_CLASSES, 
												parents:[],											
		                             			type:CLASS_TYPE_NAME.SCHEMA_GROUP,
		                             			label:CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES ,
		                             			children:[],
		                             			comment:CLASS_TYPE_NAME_LABEL.DOCUMENT_CLASSES}
		                             			

	_rootIndexObj[CLASS_TYPE_NAME.CHOICE_CLASSES]={name:CLASS_TYPE_NAME.CHOICE_CLASSES, 
												parents:[],											
		                             			type:CLASS_TYPE_NAME.SCHEMA_GROUP,
		                             			label:CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES ,
		                             			children:[],
		                             			comment:CLASS_TYPE_NAME_LABEL.CHOICE_CLASSES}	
	return _rootIndexObj	                             			  

}
