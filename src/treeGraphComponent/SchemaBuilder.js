import React,{useState} from 'react';
import { SizeMe } from 'react-sizeme' 
import SplitPane from "react-split-pane";
import {ModelTreeComponent} from './ModelTreeComponent';
import {DetailsModelComponent} from './detailsComponent/DetailsModelComponent';

export const SchemaBuilder = (props)=>{


	//const [selectedNode, setSelectedNode]=useState(null);

	const [currentNodeJson,setCurrentNode]= useState(null);

	const panelIsOpen=props.panelIsOpen || true;

	const mainPanelSize=panelIsOpen ? "calc(100% - 450px)" : "100%";
	const treeMainGraphObj=props.treeMainGraphObj;

	const changeCurrentNode=(nodeId)={
		//if(nodeId===null)setCurrentNode(null);
		//else if(treeMainGraphObj && treeMainGraphObj[nodeId]){
		//	setCurrentNode(treeMainGraphObj[nodeId]);
		//}
	}
	return (
		<SplitPane className="colWindow" split="vertical" minSize={400} size={mainPanelSize}>							   							
			<div>
				<SizeMe monitorHeight={true}>{({ size }) =>
		            <div style={{ minHeight:"400px", height: "calc(100vh - 10px)"}}>
		              {treeMainGraphObj && <ModelTreeComponent changeCurrentNode={changeCurrentNode} setSelectedNode={setSelectedNode} width={size.width} height={size.height} treeMainGraphObj={treeMainGraphObj}/>}
		              </div>
		              }
		        </SizeMe>
		    </div>
	        <DetailsModelComponent selectedNode={currentNodeJson}/>	    
	       </SplitPane>
	)
}

/*
<SplitPane className="colWindow" split="vertical" defaultSize={200} primary="second" >							   							
			<div>
				<SizeMe monitorHeight={true}>{({ size }) =>
		            <div style={{ minHeight:"400px", height: "calc(100vh - 10px)"}}>
		              {treeMainGraphObj && <ModelTreeComponent width={size.width} height={size.height} treeMainGraphObj={treeMainGraphObj}/>}
		              </div>
		              }
		        </SizeMe>
	        </div>
	        <div/>
	    </SplitPane>*/