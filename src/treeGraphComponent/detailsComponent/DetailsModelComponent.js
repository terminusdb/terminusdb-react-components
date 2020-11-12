import React,{useState,useEffect,Fragment} from 'react';
import PropTypes from "prop-types";
import {Accordion} from '../../form/Accordion'
import Tabs from 'react-responsive-tabs';
import {BaseElement} from './BaseElement';
import 'react-responsive-tabs/styles.css';
import {ConstraintsComponent} from './ConstraintsComponent';
import {ParentsFilter} from './ParentsFilter';
import {PropertiesComponent} from './PropertiesComponent';
import {ELEMENT_ICONS} from '../../constants/details-labels';
import {ChoiceList} from './ChoiceList';

export const DetailsModelComponent = (props)=>{
	
	const [tabKey,setTabKey]=useState(1)

	const nodeData = props.currentNodeJson ? props.currentNodeJson : {}
	const objPropsRelatedToClass = props.objPropsRelatedToClass || []
	const childrenArr = nodeData.children || []
	const hasConstraints = (childrenArr.length>0 || objPropsRelatedToClass.length >0) ? true : false; 
	const imageType=ELEMENT_ICONS[nodeData.type]

	useEffect(() => {
        setTabKey(1)
    },[props.currentNodeJson])

	const getTabs=()=>{
		const tabsArr=[]
		tabsArr.push({title:'Class',
	             getContent: () =><BaseElement elementId={nodeData.name} elementType={nodeData.type} removeElement={props.removeElement} showCardinality={false} hasConstraints={hasConstraints} nodeJsonData={nodeData} updateValue={props.updateValue}/>
						 	 	,				    
						    	key: 1,
						    	tabClassName: 'tab',
						    	panelClassName: 'tdb__panel'
							})
		if(nodeData.type==='ChoiceClass'){
			tabsArr.push({title:'Choices List',
	             getContent: () =><ChoiceList updateChoiseList={props.updateChoices} choices={nodeData.choices} />
	             				  ,				    
						    	key: 2,
						    	tabClassName: 'tab',
						    	panelClassName: 'tdb__panel'
							})
		}else if(nodeData.type!=='ChoiceClass'){
			tabsArr.push({title:'Properties',
	            getContent: () =><PropertiesComponent />,
						    	key: 2,
						    	tabClassName: 'tab',
						    	panelClassName: 'tdb__panel'})
		}
		tabsArr.push({title:'Relationship',
	            getContent: () =><Fragment>
	         						<ConstraintsComponent objectPropertyList={props.objectPropertyList} nodeJsonData={nodeData} objPropsRelatedToClass={props.objPropsRelatedToClass}/>
	         						{nodeData.type!=='ChoiceClass' &&
	         							<ParentsFilter/>
	         				  		}
         				  		</Fragment>
         				  	,

				    	key: 3,
				    	tabClassName: 'tab',
				    	panelClassName: 'tdb__panel'
				})

		return tabsArr;
	} 

	const changeTab=(key)=>{
		if(!currentNodeJson.id){
			alert('please add a valid ID');
		}else{
			setTabKey(key)
		}
	}

	return(
		<div className="tdb__sidebar" >
			<div className="tdb__panel__title">
	  	 		<i className={`tdb__panel__title__icon ${imageType}`}></i>
	  	 		{nodeData.label || nodeData.id}
	  	 	</div>
			<Tabs items={getTabs()} transform={false} onChange={setTabKey} selectedTabKey={tabKey}/>
		</div>
	)
}

DetailsModelComponent.propTypes = {
    currentNodeJson:PropTypes.object,
}

DetailsModelComponent.defaultProps = {
    currentNodeJson: {}
};
