import * as NODE_ACTION_NAME from '../utils/actionType'
import {CLASS_TYPE_NAME} from '../utils/elementsName'

const getElementsStyle=()=>{
	const elementsStyleTmp={}
	elementsStyleTmp[CLASS_TYPE_NAME.DOCUMENT_CLASSES]={fillColor:"#ffb266",lineColor:"#ffb266",lineSize:2}
	elementsStyleTmp[CLASS_TYPE_NAME.OBJECT_CLASSES] = {fillColor:"#96e997",lineColor:"#96e997",lineSize:2}
	elementsStyleTmp[CLASS_TYPE_NAME.CHOICE_CLASSES] = {fillColor:"#a783c9",lineColor:"#a783c9",lineSize:2}
	elementsStyleTmp[CLASS_TYPE_NAME.DOCUMENT_CLASS]={fillColor:"#ffb266",lineColor:"#ffb266",lineSize:2}
	elementsStyleTmp[CLASS_TYPE_NAME.OBJECT_CLASS]= {fillColor:"#96e997",lineColor:"#96e997",lineSize:2}
	elementsStyleTmp[CLASS_TYPE_NAME.CHOICE_CLASS] =  {fillColor:"#a783c9",lineColor:"#a783c9",lineSize:2}

	elementsStyleTmp[CLASS_TYPE_NAME.SCHEMA_ROOT] ={fillColor:"#1eadfb",lineColor:"#1eadfb",lineSize:2}

	return elementsStyleTmp;
}


export const elementsStyle=getElementsStyle()

export const groupMenuList={'ROOT':[{id:NODE_ACTION_NAME.ADD_NEW_ENTITY, label: "Add Document Type"},
					  				{id:NODE_ACTION_NAME.ADD_NEW_CLASS, label: "Add Object Type"},
					  				{id:NODE_ACTION_NAME.ADD_NEW_CHOICE_CLASS, label: "Add Choice Type"}],
					  'OrdinaryClasses':[{id:NODE_ACTION_NAME.ADD_NEW_CLASS, label: "Add Object Type"}],
					  'ChoiceClasses':  [{id:NODE_ACTION_NAME.ADD_NEW_CHOICE_CLASS, label: "Add Choice Type"}],
					  'DocumentClasses':[{id:NODE_ACTION_NAME.ADD_NEW_ENTITY, label: "Add Document Type"}]}

export const nodeMenuList=[{id:NODE_ACTION_NAME.ADD_PARENT, label: "Add Parent"},
				  		   {id:NODE_ACTION_NAME.ADD_CHILD, label: "Add Child"}]

