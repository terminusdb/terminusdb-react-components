import React,{useState,useEffect} from 'react';
import {ADD_PARENT,REMOVE_PARENT} from '../utils/actionType'
import {ListComponent} from './ListComponent'
import {BaseSelectReactElement} from './BaseSelectReactElement'
import {BaseSelectComponent} from './BaseSelectComponent'
import {ParentsElementViewMode} from './viewMode/ParentsElementViewMode'
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

	return (	<>
				<div className="tdb__panel__box">
				    <div className="tdb__list">
				     	<div className="tdb__list__title" > Parents </div>
			     		<div className="tdb__list__items" >
			     			{nodeJsonData.parents.length===0 && 'No Parents'}
 			     			<ListComponent removeItem={removeParent} elementId={elementId} elementType={elementType} dataProvider={listDataProvider}/>					 
						 </div>						 
						 {parentClassType!== "Class" && 					 	
							<BaseSelectComponent
								defaultValue={classType} 
								dataProvider={elementClassList} 
								optionChange={changeParentList} 
								showLabel={false}  
								id='elementsType'/>					 	
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
				{nodeJsonData.parents.length>0 &&
					<ParentsElementViewMode />
				}
				</>
				
	)
}

/*
 
					 <BaseSelectReactElement 
					 	resetSelection={true} 
						isClearable={false} 
						onChange={addParent} 
						placeholder='Add a new Parent' 
						dataProvider={dataProvider} />	*/