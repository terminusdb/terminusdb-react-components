import React,{useState,useEffect} from 'react';
import {ADD_PARENT,REMOVE_PARENT} from '../utils/actionType'
import {ListComponent} from './ListComponent'
import {BaseSelectReactElement} from './BaseSelectReactElement'
import {BaseSelectComponent} from './BaseSelectComponent'
import {ParentsElementViewMode} from './viewMode/ParentsElementViewMode'
import {GraphContextObj} from '../hook/graphObjectContext';

export const ParentsFilter = (props) => {
	const {selectedNodeObject,updateParentsList,availableParentsList} = GraphContextObj();
	const [classType,setClassType]=useState('Class')
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
	},[availableParentsList])

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
		updateParentsList(parentName,ADD_PARENT)
	}

	const removeParent=(selectedValue)=>{
		updateParentsList(selectedValue,REMOVE_PARENT)
	}
		
	const elementClassList=[{label:'Document Classes',value:'Document'},
							{label:'Object Classes',value:'Class'}]

		
    const elementId=selectedNodeObject.name;
    const elementType=selectedNodeObject.type;

    const title='Edit Parents';
    const tooltip='Tooltip';

    const listDataProvider=selectedNodeObject.parents || [];
    const parentClassType=selectedNodeObject.type 

	return (	<>
				<div className="tdb__panel__box">
				    <div className="tdb__list">
				     	<div className="tdb__list__title" > Parents </div>
			     		<div className="tdb__list__items" >
			     			{listDataProvider.length===0 && 'No Parents'}
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
							 	name="addParent"
							 	resetSelection={true} 
								isClearable={false} 
								onChange={addParent} 
								placeholder='Add a new Parent' 
								dataProvider={dataProvider} 
								optionChange={addParent}/>
					
					</div>
				</div>	
				{listDataProvider.length>0 &&
					<ParentsElementViewMode />
				}
				</>
				
	)
}