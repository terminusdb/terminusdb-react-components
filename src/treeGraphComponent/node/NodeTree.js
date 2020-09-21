import React from 'react';
//import { connect } from 'react-redux'
//import {clickTreeNode} from '../../../actions/treeModelActions'
//
import NodeMenu from './NodeMenu'
//import {MODEL_RIGHT_WINDOW_OBJ} from '../../../constants/ObjectsName'

//import {NODE_ACTION_NAME} from '../../../constants/ActionTypes'


const elementsStyle={'DocumentClass':{fillColor:"#ffb266",lineColor:"#ffb266",lineSize:2},
					'Relationship':{fillColor:"#306c90",lineColor:"#306c90",lineSize:2},
					'ObjectClass':{fillColor:"#96e997",lineColor:"#96e997",lineSize:2},
				    'Group':{fillColor:"#76cdff",lineColor:"#76cdff",lineSize:2},
				    'ROOT':{fillColor:"#1eadfb",lineColor:"#1eadfb",lineSize:2}}

export const NodeTree=(props)=> {

	/*menuList={'ROOT':[{id:NODE_ACTION_NAME.ADD_NEW_ENTITY, label: "Add EntityClass"},
				  {id:NODE_ACTION_NAME.ADD_NEW_CLASS, label: "Add OrdinaryClass"},
				  {id:NODE_ACTION_NAME.ADD_NEW_RELATIONSHIP, label: "Add Relationship"}],
			  'OrdinaryClassesGroup':[{id:NODE_ACTION_NAME.ADD_NEW_CLASS, label: "Add OrdinaryClass"}],
			  'DocumentClasses':[{id:NODE_ACTION_NAME.ADD_NEW_ENTITY, label: "Add EntityClass"},
			                     {id:NODE_ACTION_NAME.ADD_NEW_RELATIONSHIP, label: "Add Relationship"}]}

	nodeMenuList=[{id:NODE_ACTION_NAME.ADD_PARENT, label: "Add Parent"},
				  {id:NODE_ACTION_NAME.ADD_CHILD, label: "Add Child"}]*/


	const width=100;

	const formatLabel=(label)=>{
		  const minLabel=label.trim().replace(/A | a | an /g,' '); 
		  let labelArr=minLabel.trim().split(" ");
		  if(labelArr.length===1)return label;
		  var distance=8;
		  var startDistance=-(distance*(labelArr.length-1));

		  let labelObj = labelArr.map((labelWord,index)=>{
		      return (
		           <tspan key={`tspan ${index}`} x={0} dy={index===0 ? startDistance : distance*2}>
		            {labelWord}
		           </tspan>
		        )
  		})
 
 		return labelObj;
	}

	const getNode=()=>{
		
		const node=props.node;
		const elemStyle=elementsStyle[node.data.type] || {};
		let fillColor=elemStyle.fillColor || '#1eadfb';
		let lineSize=elemStyle.lineSize || 2;
		let lineColor=elemStyle.lineColor || '#1eadfb';
		const comment = props.newComment ||  node.data.comment || '';


		/*if(node.data.name==="terminusdb:///schema#InterestGroup"){
			fillColor='#ffff00'
			console.log("____NODE___DATA___",node.data);
		}*/

		if(props.isSelected){
  				lineSize=4;
  				lineColor='#696969';
  		}

		switch(node.data.type){
			case 'DocumentClass':
			    return <rect x={-width/2} y={-width/2} 
			      		 width={width} 
			      		 height={width} 
			      		 fill={fillColor} 
			      		 stroke={lineColor}
				         strokeWidth={lineSize}
				         cursor={'pointer'}
				      	 onClick={props.onClick}
				      	 rx="15"/>
			case 'Relationship':
				return (<circle 
				          markerEnd={props.isSelected ? 'url(#nodeTreeList)' : '' }
				          r={width/2}		         
				          fill={fillColor}
				          stroke={lineColor}
				          strokeWidth={lineSize}
				          cursor={'pointer'}
				      	  onClick={props.onClick}	>	          
			             <title>
			        	{comment}
				        </title>				         
				        </circle>)

			case 'ObjectClass':
				return (<circle 
				          markerEnd={props.isSelected ? 'url(#nodeTreeList)' : '' }
				          r={width/2}		         
				          fill={fillColor}
				          stroke={lineColor}
				          strokeWidth={lineSize}
				          cursor={'pointer'}
				      	  onClick={props.onClick}	>	          
			             <title>
			        	{comment}
				        </title>				         
				        </circle>)
			default:
			   return <ellipse rx="100" ry="50" fill={fillColor}
						          stroke={lineColor}
						          strokeWidth={lineSize}
				  				  onClick={props.onClick}/>
		}
	}

	//const render = ()=>{
			const node=props.node
			
			const nodex=props.nodex
			const nodey=props.nodey

  			//const menuList = menuList[node.data.name] ? menuList[node.data.name] : nodeMenuList;
			//let showAddAttribute = node.data.type==="group" ? false : true;
			
			const isEditMode= props.isEditMode===true ? true : false;

			
			const label = props.newLabel ||  node.data.label || '';

  			
		  return (
		    <g indexpos={props.indexPos} className={'node'} transform={`translate(${nodex},${nodey})`} name={node.data.name} id={node.data.name} >
		      {getNode()}
		      
		      <text    
		        fontSize={14}
		        fontFamily="Arial"
		        textAnchor={"middle"}
		        style={{ pointerEvents: "none" }}
		        fill={"#000000"}
		        dominantBaseline="central"
		        alignmentBaseline="central"
		      >
		       {formatLabel(label)}
		      </text>

		      {/*props.isSelected && props.isEditMode && 
		      	<NodeMenu width={width} nodeId={node.data.name} menuList={menuList}/>
		      */}
		    </g>
		  )
	//}
}

/*const mapStateToProps = (state, ownProps) => {
	let isSelected=false;
	const {lastTreeNodeClicked,windowModeIsChanged}=state

	const treeNodeDataChanged = state.treeNodeDataChanged || {};

	if(lastTreeNodeClicked.nodeId && lastTreeNodeClicked.nodeId===ownProps.node.data.name){

    	isSelected=lastTreeNodeClicked.toBeSelected;
	}

	const payload=treeNodeDataChanged[ownProps.id] || {}

	const {label, comment} = payload;

	const isEditMode=windowModeIsChanged[MODEL_RIGHT_WINDOW_OBJ]
	return {isSelected,isEditMode,newLabel:label, newComment:comment};
}*/

/*const mapDispatchToProps = (dispatch, ownProps) => (
{
  onClick: () => {
  	const {name}=ownProps.node.data;
    dispatch(clickTreeNode(name,null))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeTree)*/


