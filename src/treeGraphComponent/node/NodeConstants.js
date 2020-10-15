import * as NODE_ACTION_NAME from '../utils/actionType'

export const elementsStyle={'Document':{fillColor:"#ffb266",lineColor:"#ffb266",lineSize:2},
							'Class':{fillColor:"#96e997",lineColor:"#96e997",lineSize:2},
						    'Group':{fillColor:"#76cdff",lineColor:"#76cdff",lineSize:2},
						    'ROOT':{fillColor:"#1eadfb",lineColor:"#1eadfb",lineSize:2}}

export const groupMenuList={'ROOT':[{id:NODE_ACTION_NAME.ADD_NEW_ENTITY, label: "Add EntityClass"},
					  				{id:NODE_ACTION_NAME.ADD_NEW_CLASS, label: "Add OrdinaryClass"}],
					  'OrdinaryClasses':[{id:NODE_ACTION_NAME.ADD_NEW_CLASS, label: "Add OrdinaryClass"}],
					  'DocumentClass':[{id:NODE_ACTION_NAME.ADD_NEW_ENTITY, label: "Add EntityClass"}]}

export const nodeMenuList=[{id:NODE_ACTION_NAME.ADD_PARENT, label: "Add Parent"},
				  		   {id:NODE_ACTION_NAME.ADD_CHILD, label: "Add Child"}]

