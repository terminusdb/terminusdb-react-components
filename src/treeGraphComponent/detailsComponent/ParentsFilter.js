import React,{useState,useEffect} from 'react';
import {ADD_PARENT,REMOVE_PARENT} from '../utils/actionType'
import {ListComponent} from './ListComponent'
import {BaseSelectReactElement} from './BaseSelectReactElement'
import {BaseSelectComponent} from './BaseSelectComponent'

export const ParentsFilter = (props) => {

	const [classType,setClassType]=useState('Class')
	const availableParentsList = props.availableParentsList || {}
 	const [dataProvider,setDataProvider]=useState(availableParentsList.classesListArr || [])

	const getClassDataProvider=(classTypeName)=>{
		let dataProvider=[];
		switch(classTypeName){
			case 'Document':
		    	  dataProvider=availableParentsList.documentClassArr 
		    	  break;
		    default:
		        dataProvider=availableParentsList.objectClassArr;//.concat(props.ordinaryClassDataP)
				break;
		        	
		}
		setDataProvider(dataProvider)
	}

	useEffect(() => {

		getClassDataProvider(classType)

	},[props.availableParentsList])

	const changeParentList=(elementId,elementValue)=>{
		//if(evt.currentTarget.value){
			setClassType(elementValue)
			getClassDataProvider(elementValue);
		//}
	}

	/*
	* to be review the parameter orders
	*/
	const addParent=(elementId,parentName)=>{
		props.updateParentsList(parentName,ADD_PARENT)
	}

	const removeParent=(selectedValue)=>{
		props.updateParentsList(selectedValue,REMOVE_PARENT)
	}
		
	const elementClassList=[{label:'Document Classes',value:'Document'},
							{label:'Object Classes',value:'Class'}]

		
    const nodeJsonData = props.nodeJsonData || {}
    const elementId=nodeJsonData.name;
    const elementType=nodeJsonData.type;

    const title='Edit Parents';
    const tooltip='Tooltip';

    const listDataProvider=nodeJsonData.parents || [];
    const parentClassType=nodeJsonData.type 

	return (<div>
				<div className="itemBaseSchema">This is the list of the Parents .........</div>	
				<div className="itemBaseSchema">
				     <ListComponent removeItem={removeParent} elementId={elementId} elementType={elementType} dataProvider={listDataProvider}/>
					 {parentClassType!== "Class" && 
					 	<div className="tdb__panel__box">
							<BaseSelectComponent
								defaultValue={classType} 
								dataProvider={elementClassList} 
								optionChange={changeParentList} 
								showLabel={false}  
								id='elementsType'/>
					 	</div>
					 }
					 <BaseSelectReactElement
					 	id="addParent"
					 	resetSelection={true} 
						isClearable={false} 
						onChange={addParent} 
						placeholder='Add a new Parent' 
						dataProvider={dataProvider} 
						optionChange={addParent}/>	  		
				</div>
			</div>
	)
}

/*
 
					 <BaseSelectReactElement 
					 	resetSelection={true} 
						isClearable={false} 
						onChange={addParent} 
						placeholder='Add a new Parent' 
						dataProvider={dataProvider} />	*/