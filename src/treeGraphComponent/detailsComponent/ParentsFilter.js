import React,{useState,useEffect} from 'react';
import {ADD_PARENT,REMOVE_PARENT} from '../utils/actionType'
import {ListComponent} from './ListComponent'
import {BaseSelectReactElement} from './BaseSelectReactElement'
import {BaseSelectComponent} from './BaseSelectComponent'
import {ParentsElementViewMode} from './viewMode/ParentsElementViewMode'
import {GraphContextObj} from '../hook/graphObjectContext';
import {Accordion} from  '../../form/Accordion'

export const ParentsFilter = (props) => {
	const {selectedNodeObject,graphDataProvider,updateParentsList,availableParentsList} = GraphContextObj();

	const [classType,setClassType]=useState('Class')
	const [dataProvider,setDataProvider]=useState(availableParentsList.classesListArr || [])
	//const [listDataProvider,setListParents]=useState([])

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

    const getParentList=()=>{
    	const parents=selectedNodeObject.parents || [];
    	const listParent=[]
    	parents.forEach((parentName,index)=>{
    		const elementObj=graphDataProvider.get(parentName);
			const elementData=elementObj.data;
			const label=elementData.label || elementData.id
    		listParent.push({name:elementData.name,label:label})
    	})
    	return listParent;
   }
    const listDataProvider=getParentList();
    
    const parentClassType=selectedNodeObject.type 

	return (	<>
				<div className="tdb__panel__title tdb__panel__title--parent">
		  	 		Parent List
		  	 	</div>
		  	 	{listDataProvider.length>0 &&
					<ParentsElementViewMode />
				}
				<Accordion titleClassName="tdb__accordion__head--green"
									leftIconClassName = "custom-img-inherit-line"
									title="Add/Remove Parents"  
									tooltip="Add/Remove Parents">
				<div className="tdb__panel__box">
				    <div className="tdb__list">
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
								name='elementsType'/>					 	
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
				</Accordion>
				</>
				
	)
}