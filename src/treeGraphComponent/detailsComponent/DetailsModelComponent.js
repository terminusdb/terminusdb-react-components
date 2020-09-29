import React from 'react';
import {Accordion} from '../../form/Accordion'
import Tabs from 'react-responsive-tabs';
import {BaseElement} from './BaseElement';
import 'react-responsive-tabs/styles.css';
//properties
//node
//parents
//appearance

export const DetailsModelComponent = (props)=>{


	const getTabs=()=>{

		const tabsArr=[{title:'Element',
	             getContent: () =><div className="tdb__panel">

	             			<BaseElement currentNodeJson={props.selectedNode}/>

						 	 </div>,
		
						    
						    	key: 1,
						    	tabClassName: 'tab',
						    	panelClassName: 'panel'
							},
							{title:'Properties',
	             			getContent: () =><div className="tdb__panel">
	             					properties
	             				  </div>,
		
						    	key: 2,
						    	tabClassName: 'tab',
						    	panelClassName: 'panel'
						    }]
		return tabsArr;
		} 

	return(
		<div className="tdb__sidebar" >
			<Tabs items={getTabs()} transform={false}/>
		</div>
	)
}
