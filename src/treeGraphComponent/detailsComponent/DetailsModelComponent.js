import React,{useState,useEffect,Fragment} from 'react';
import PropTypes from "prop-types";
import {Accordion} from '../../form/Accordion'
import {BiNetworkChart} from "react-icons/bi"

/*
* remove and use react-bootstrap
*/
import Tabs from 'react-responsive-tabs';
import {BaseElement} from './BaseElement';
import 'react-responsive-tabs/styles.css';
import {ConstraintsComponent} from './ConstraintsComponent';
import {ParentsFilter} from './ParentsFilter';
import {PropertiesComponent} from './PropertiesComponent';
import {ELEMENT_ICONS} from '../../constants/details-labels';
import {ChoiceList} from './ChoiceList';
import {getLabelByName} from '../utils/elementsName'

export const DetailsModelComponent = (props)=>{

	const [tabKey,setTabKey]=useState(1)
	const nodeData = props.currentNodeJson ? props.currentNodeJson : {}
	const objPropsRelatedToClass = props.objPropsRelatedToClass || []
	const childrenArr = nodeData.allChildren || []
	const hasConstraints = (childrenArr.length>0 || objPropsRelatedToClass.length >0) ? true : false;
	const imageType=ELEMENT_ICONS[nodeData.type]
	const title=getLabelByName(nodeData.type);

	useEffect(() => {
        setTabKey(1)
    },[props.currentNodeJson])

	const getTabs=()=>{
		const tabsArr=[]
		tabsArr.push({title:title,
	             getContent: () =><BaseElement key={`base__${nodeData.name}`}
	    							removeElement={props.removeElement}
	    							showCardinality={false}
	    							hasConstraints={hasConstraints}
	    							nodeJsonData={nodeData}
	    							updateValue={props.updateValue}/>
							 	 	,
							    	key: 1,
							    	tabClassName: 'tab',
							    	panelClassName: 'tdb__panel'
							})
		if(nodeData.type==='ChoiceClass'){
			tabsArr.push({title:'Values',
	             getContent: () =><ChoiceList key={`choice__${nodeData.name}`}
	             					updateChoiseList={props.updateChoices}
	             					choices={nodeData.choices} />
	             				  ,
						    	key: 2,
						    	tabClassName: 'tab',
						    	panelClassName: 'tdb__panel'
							})
		}else if(nodeData.type!=='ChoiceClass'){
			tabsArr.push({title:'Properties',
	            getContent: () =><PropertiesComponent custom={props.custom} key={`properties__${nodeData.name}`}/>,
							    	key: 2,
							    	tabClassName: 'tab',
							    	panelClassName: 'tdb__panel'})
		}
		tabsArr.push({title:'Relationships',
	            getContent: () =><Fragment>
	         						<ConstraintsComponent key={`const__${nodeData.name}`}/>

	         						<ParentsFilter key={`parent__${nodeData.name}`}/>

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
	const label=nodeData.label || nodeData.id

	if(props.custom) {
		return <div class="px-0 col-12 ml-3 mr-3 pr-3">
			<div class="shadow-sm card border-light">
				<div class="card-body">
					<div>
						<div className="d-flex">
							<BiNetworkChart className="schema-summary-icons"/>
							<h5 className="ml-3" title={label}>{label}</h5>
						</div>
						<Tabs panelClassName="bg-dark" tabsWrapperClass="bg-dark" tabClassName="bg-dark" items={getTabs()} transform={false} onChange={setTabKey} selectedTabKey={tabKey}/>
					</div>
				</div>
			</div>
		</div>
	}

	return(
		<div className="tdb__sidebar" >
			<div className="tdb__panel__title">
	  	 		<i className={`tdb__panel__title__icon ${imageType}`}></i>
	  	 		<p className="tdb__panel__label" title={label}> {label}</p>
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
