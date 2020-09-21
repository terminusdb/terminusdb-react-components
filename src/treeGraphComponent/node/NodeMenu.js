import React from 'react';
import NodeMenuList from './NodeMenuList'

export default class NodeMenu extends React.Component  {

    
    constructor(props){
    	super(props)
    	this.state={showMenu:false};
    	this.showHideNodeMenu=this.showHideNodeMenu.bind(this);
    }

	showHideNodeMenu(){
		let showMenu = this.state.showMenu ? false : true;

		this.setState({showMenu:showMenu});
	}

	render(){
		let width=this.props.width;
		return(

			<g transform={`translate(${width/4},${-width/3})`}  id="node_add_children_icon" cursor={'pointer'}   onClick={this.showHideNodeMenu}>
		      	<rect width="20" 
		      		height="20" 
		      		fill="#ffffff" 
		      		stroke="#cccccc"		      		
		      	/>
		      	<text    
		        	fontSize={24}
		        	fontFamily="Arial"
		        	style={{ pointerEvents: "none" }}
		        	y={18}
		        	x={2}
		        	fill={"#000000"}
		      	> {this.state.showMenu ? 'x' : '+'} </text>
		      	{this.state.showMenu && <NodeMenuList {...this.props} />}	      	
		      </g>
		)
	}
}