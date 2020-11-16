export const TOOLBAR_LABELS={"ResetButtonTooltip":"Reset from start",
	                            "UndoButtonTooltip":"Undo",
	                            "RedoButtonTooltip":"Redo",
	                            "SaveButtonTooltip" : "Save ",
	                            "EditModeTooltip" : "Change to Edit Mode",
	                            "ViewModeTooltip" : "Change to View Mode",
	                            "ZoomInTooltip": "Zoom In",
	                            "ZoomOutTooltip": "Zoom Out",
	                            "ResetViewPoint": "Reset View"
                      		}


export const TERMINUS_IMAGE_BASE = "https://assets.terminusdb.com/terminusdb-console/images/"
export const TERMINUS_FONT_BASE = "https://assets.terminusdb.com/terminusdb-console/fonts/"

//decimal, integer ,  decimalRange,long, bite,short,
export const PROPERTY_STRING_BY_RANGE={'string':'xsd:string',
										'json':'xdd:json',
										'base64Binary':'xsd:base64Binary',
										'html':'xdd:html',
										'url':'xdd:url'};

export const PROPERTY_NUMBER_BY_RANGE={ 'integer':'xsd:integer', 
										'decimal':'xsd:decimal',
										'long':'xsd:long',
										'bite':'xsd:bite',
										'short':'xsd:short',
										'decimalRange':'xdd:decimalRange',
										'unsignedByte':'xsd:unsignedByte',
										'unsignedInt':'xsd:unsignedInt',
										'unsignedLong':'xsd:unsignedLong',
										'positiveInteger':'xsd:positiveInteger',
										'nonNegativeInteger':'xsd:nonNegativeInteger',
										'nonPositiveInteger':'xsd:nonPositiveInteger',
										'negativeInteger':'xsd:negativeInteger'}

	
export const PROPERTY_GEO_BY_RANGE={'coordinate':'xdd:coordinate',
									'coordinatePolyline':'xdd:coordinatePolyline',
									'coordinatePolygon':'xdd:coordinatePolygon'}

export const PROPERTY_TEMPORAL_BY_RANGE={'dateTime':'xsd:dateTime',
										 'gYear':'xsd:gYear',
										 'gYearRange':'xdd:gYearRange',
										 'gMonth':'xsd:gMonth',
										 'gDay':'xsd:gDay',
										 'gYearMonth':'xsd:gYearMonth',
										 'gMonthDay':'xsd:gMonthDay',
										 'duration':'xsd:duration',
										 'dateRange':'xdd:dateRange',
										 'date':'xsd:date',
										 'time':'xsd:time',
										 'dateTimeStamp':'xsd:dateTimeStamp'}


export const ELEMENT_BASE_CONST={
	SCHEMA_ELEMENT_LABEL_ID:'label',
	SCHEMA_ELEMENT_DESCRIPTION_ID:'description',
	SCHEMA_ELEMENT_ID:'id',
	SCHEMA_ELEMENT_ABSTRACT_ID : 'abstract',

	LABEL_TEXT:'Label',
	DESCRIPTION_TEXT:'Description',
	ID_TEXT:'Unique ID',
	ABSTRACT_TEXT:'Abstract',

	LABEL_PLACEHOLDER:'Enter a label',
	DESCRIPTION_PLACEHOLDER:'Enter a Description',
	ID_PLACEHOLDER:'Enter a valid Unique ID',
	ABSTRACT_PLACEHOLDER:'Abstract',
}


export const STRING_TYPE_LABEL='String Type';
export const STRING_TYPE_ELEMENT_ID='value_type';

export const GEO_PROPERTY_VALUE_ID='value_type';


/*  
*/
export const STRING_TYPE_DATAPROVIDER={label: 'String Type',
	                                   id:'range',
	                                   options:[{label:'String', value:'xsd:string'},
									  {label:'Json', value:'xdd:json',description:'A JSON Encoded String'},
									  //{label:'Text', value:'text'},
									  {label:'Base64 Binary', value:'xsd:base64Binary', description:'An xsd:base64Binary value.'},
									  
									  {label:'URL', value:'xdd:url' ,'description':'A valid url.'},
									  {label:'HTML', value:'xdd:html', description:'A safe HTML string'},
									  //{label:'RDFA', value:'rdfa'},
									  {label:'Email', value:'xdd:email',description:'A valid email address.'}
									  //{label:'ID', value:'id'}
									  ]}



export const CLASS_PROPERTIES_LIST=[{label:'Choice Property', id:'ChoiceProperty',range:''},
		    					   {label:'Numeric Property', id:'NumericProperty',defaultRange:'xsd:decimal'},
		    					   {label:'String Property', id:'StringProperty',defaultRange:'xsd:string'},
		    					   {label:'Geo Property', id:'GeoProperty',defaultRange:'xsd:string'},
		    					   {label:'Temporal Property', id:'TemporalProperty',defaultRange:'xsd:dateTime'},
		    					   {label:'Link Property', id:'LinkProperty',defaultRange:''}]


export const GET_ICON_NAME={StringProperty:'custom-img-string',
							NumericProperty:'custom-img-number_alt',
							ChoiceProperty:'custom-img-choice',
							GeoProperty:'custom-img_map',
							TemporalProperty:'custom-img-temporal',
							LinkProperty:'custom-img-classes'}


export const UNITS_ELEMENT_ID='units';
export const PRECISION_ELEMENT_ID='value_type';	
export const NUMERIC_TYPE_ELEMENT_ID='interpretation'; 

export const NUMBER_PROPERTY_PRECISION_DATAPROVIDER={label:'Precision',
													id:'range',
													options:[{label:'Decimal', value:'xsd:decimal'},
										            {label:'Integer', value:'xsd:integer',description:'A simple number. An xsd:integer value.'},
										            //{label:'Decimal', value:'xsd:decimal', description:'A decimal value (e.g. 23.34)'},
										            {label:'Decimal Range', value:'xdd:decimalRange',description:'Uncertain range of decimal values (e.g.[23.4, 4.143]. Enables uncertainty to be encoded directly in the data'},
										            {label:'Long', value:'xsd:long', description:'An xsd:long value.'},
										            {label:'Bite', value:'xsd:bite', description:'An xsd:byte value'},
										            {label:'Short', value:'xsd:short', description:'An xsd:short value'},
										            {label:'Unsigned Byte', value:'xsd:unsignedByte', description:'An xsd:unsignedByte value'},
										            {label:'Unsigned Integer', value:'xsd:unsignedInt', description:'An xsd:unsignedInt value'},
										            {label:'Unsigned Long', value:'xsd:unsignedLong', description:'An xsd:unsignedLong value'},
										            {label:'Positive Integer', value:'xsd:positiveInteger',description:'A simple number greater than 0. An xsd:positiveInteger value.'},
										            {label:'Non-negative Integer', value:'xsd:nonNegativeInteger',description:"A simple number that can't be less than 0. An xsd:nonNegativeInteger value."},
										            {label:'Non-positive Integer', value:'xsd:nonPositiveInteger',description:"A number less than or equal to zero. An xsd:nonPositiveInteger value."},
										            {label:'Negative Integer', value:'xsd:negativeInteger',description:'A negative integer. An xsd:negativeInteger value.'}]};

export const NUMBER_PROPERTY_TYPE_DATAPROVIDER=[{label:'Non Specified', value:''},
											   {label:'Count', value:'count'},
											   {label:'Measure', value:'measure'},
											   {label:'Percentage', value:'percentage'},
											   {label:'Currency', value:'currency'},
											   {label:'Index', value:'index'},
											   {label:'Credit Card Number', value:'cc'}];



/*export const TEMPORAL_SCOPE_TYPE_DATAPROVIDER ={label:'Temporal Scoping',
	                                  id:'scoping', options:[{label:'Non Specified', value:''},
	                                  {label:'Point',value:'timepoint'},
									  {label:'Range',value:'timerange'}]}*/
export const TEMPORAL_PROPERTY_DATAPROVIDER={label: 'Temporal Type',
	                                   id:'range',
	                                   options:
	                                   [{label:'Date-Time',value:'xsd:dateTime',description:''},
	                                   {label:'Year',value:'xsd:gYear',description:'A particular 4 digit year YYYY - negative years are BCE.'},
									   {label:'Year (Uncertain Range)',value:'xdd:gYearRange',description:'A 4-digit year, YYYY, or if uncertain, a range of years. An xdd:gYearRange value.'},
									   {label:'Month',value:'xsd:gMonth',description:'A particular 4 digit year YYYY - negative years are BCE.'},
									   {label:'Day',value:'xsd:gDay',description:'A particular day. An xsd:gDay value. ---DD'},
									   {label:'Year / Month', value:'xsd:gYearMonth',description:'A year and a month. An xsd:gYearMonth value.'},
									  
									   {label:'Month / Day', value:'xsd:gMonthDay',description:'A month and a day. An xsd:gMonthDay value.'},
									   {label:'Duraction',value:'xsd:duration',description:'A period of time. An xsd:duration value.'},
									   {label:'Date (Uncertain Range)',value:'xdd:dateRange',description:'A date or a range of dates YYYY-MM-DD'},
									   {label:'Date',value:'xsd:date', description:'A date. An xsd:date value. YYYY-MM-DD'},
									   {label:'Time',value:'xsd:time', description:'A time. An xsd:time value. hh:mm:ss.ssss'},
									  // {label:'Hour',value:'hour'},
									  // {label:'Second',value:'second'},
									  // {label:'Date-Time',value:'xsd:dateTime',description:'An xsd:dateTime value.'},
									   {label:'Date-Time Stamp',value:'xsd:dateTimeStamp',description:'An xsd:dateTimeStamp value.'}]}







export const GEOMETRY_PROPS_DATAPROVIDER={label:'Geometry Type',
    							id:'range',
    							options:[{label:'Coordinate', value:'xdd:coordinate'},

    							//{label:'Coordinate', value:'xdd:coordinate',description:'A particular location on the surface of the earth, defined by latitude and longitude . An xdd:coordinate value.'},
    							{label:'Coordinate Path', value:'xdd:coordinatePolyline',description:'A set of coordinates forming a line on a map, representing a route. An xdd:coordinatePolyline value.'},
    							{label:'Geographic Area',value:'xdd:coordinatePolygon', description:'A shape on a map which defines an area. within the defined set of coordinates   An xdd:coordinatePolygon value.'},
       							]}

export const CONFIDENCE_PROPS_DATAPROVIDER={label:'Value',
    							id:'confidence',
    							options:[{label:'Non Specified', value:''},
    							{label:'Percentage', value:'percent'},
    							{label:'Tag', value:'tag'}]}


    
export const ELEMENT_BASE_CLASS_LIST=[{value:'', label:'Class'},
	    							  {value:'OrdinaryClass',label:'Ordinary Class'}];

export const ELEMENT_ENTITY_LIST_ITEM={value:'EntityClass',label:'Entity Class'};

//    ELEMENT_RELATIONSHIP_ITEM:{value:'Relationship',label:'Relationship'},

export const  ELEMENT_BASE_LIST=[{value:'', label:'Class'},
		    					{value:'OrdinaryClass',label:'Ordinary Class'},
		    					{value:'EntityClass',label:'Entity Class'},
		    					{value:'Relationship',label:'Relationship'}];


export const CARDINALITY_MIN_TITLE='Cardinality Min';
export const CARDINALITY_MAX_TITLE='Cardinality Max';


export const mainGraphDescriptionText=`See New Patterns And Relationships
		Using advanced mathematical techniques TerminusDB enables the identification and visualisation of
		relationships between real-world entities, at depths unmatched by any other competing approach, and most importantly enforces compliance with whatever rules concerning those relationships we’ve already specified.

		We deliver more insight, faster than any competing approach. We call it Business Intelligence 2.0`

export const ELEMENT_ICONS ={
	'Document':'custom-img-entities',
	'Class':'custom-img-classes',
	'ChoiceClass':'custom-img-choice',
	'Relationship':'custom-img-relationship'
}

/*export default {

	OPEN_DETAILS_PANEL:'Open Details Panel',
	CANDIDATES_LIST:'Candidates List',
	EDIT_MODE:'Edit Mode',

	ENTITIES_TITLE:'Entities',
	RELATIONSHIP_TITLE:'Relationship',
	CLASSES_TITLE:'Classes',

	TEMPORAL_PROPERTY_PANEL_TITLE:'Temporal Property',
	GEOGRAPHY_PROPERTY_PANEL_TITLE:'Geography Property',

	TEMPORAL_PROPERTY_PANEL_NAME:'temporalPropertyPanelName',
	GEOGRAPHY_PROPERTY_PANEL_NAME : 'geographyPanel',

	GEOGRAPHY_PANEL_NAME : 'geography',
	TEMPORAL_SCOPING_PANEL_NAME: 'lifespan',
	GEO_TEMPORAL_SCOPING_PANEL_NAME: 'geolifespan',	
	CONFIDENCE_PANEL_NAME:'confidencePanel',
	CARDINALITY_PANEL_NAME:'cardinalityPanel',

	NUMERIC_PROPERTY_PANEL_NAME:'numericPropertyPanelName',
	STRING_PROPERTY_PANEL_NAME:'stringPropertyPanelName',

	GEOGRAPHY_TITLE:'Geography',
	TEMPORAL_SCOPING_TITLE:'Lifespan',//'Temporal Scoping',
	GEO_TEMPORAL_SCOPING_TITLE:'Location',
	CONFIDENCE_TITLE:'Confidence',
	CARDINALITY_TITLE:'Cardinality',

	SCHEMA_ELEMENT_CARDINALITY_MIN_TITLE:'Minimum',
	SCHEMA_ELEMENT_CARDINALITY_MAX_TITLE:'Maximun',


	GEOGRAPHY_PROPS_ID :'geographyProps',
	
};*/
