import React from 'react';
import PropTypes from "prop-types";
import {NodeMenu} from './NodeMenu'
import {groupMenuList , nodeMenuList, elementsStyle} from './NodeConstants'
 
export const NodeTree=(props)=> {
	const onClick=(evt)=>{
		if(props.nodeClick){
			props.nodeClick(evt.currentTarget.id);
		}
	}

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
		const elemStyleType=node.data.type==='Group' ? node.data.name : node.data.type
		const elemStyle= elementsStyle[elemStyleType] || {};
		let fillColor=elemStyle.fillColor || '#1eadfb';
		let lineSize=elemStyle.lineSize || 2;
		let lineColor=elemStyle.lineColor || '#1eadfb';
		const comment = props.newComment ||  node.data.comment || '';

		if(props.isSelected){
  			lineSize=4;
  			lineColor='#696969';
  		}

		switch(node.data.type){
			case 'Document':
			    return <rect x={-width/2} y={-width/2} 
			      		 width={width} 
			      		 height={width} 
			      		 fill={fillColor} 
			      		 stroke={lineColor}
				         strokeWidth={lineSize}
				         cursor={'pointer'}
				      	 onClick={props.onClick}
				      	 rx="15"/>
			case 'Class':
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
			case 'ChoiceClass':
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

  			const menuData = groupMenuList[node.data.name] ? groupMenuList[node.data.name] : nodeMenuList;
			//let showAddAttribute = node.data.type==="group" ? false : true;
			
			const isEditMode= props.isEditMode===true ? true : false;

			
			const label = node.data.label || node.data.id || '';

  			
		  return (
		    <g indexpos={props.indexPos} onClick={onClick} className={'node'} transform={`translate(${nodex},${nodey})`} name={node.data.name} id={node.data.name} >
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

		      {props.isEditMode!==false && props.isSelected && node.data.type!== 'ChoiceClass' && 
		      	<NodeMenu setNodeAction={props.setNodeAction} width={width} nodeId={node.data.name} menuList={menuData}/>
		      }
		    </g>
		  )
	//}
}


NodeTree.propTypes = {
    isEditMode:PropTypes.bool,
}

NodeTree.defaultProps = {
    isEditMode: true
};

