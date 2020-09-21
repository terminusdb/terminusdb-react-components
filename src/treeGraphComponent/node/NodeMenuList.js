import React from 'react';
//import { connect } from 'react-redux'
//import {treeNodeApplyAction} from '../../../actions/treeModelActions'
//import {NODE_ACTION_NAME} from '../../../constants/ActionTypes'

class NodeMenuList extends React.Component  {
	

	addMenuItems(){
	   const menuList=this.props.menuList || [];

	   let fontSize=this.props.fontSize || 16
	   let fontColor=this.props.fontColor || '#000000'

	   let menuArrItem=[];
	   let startstep=40;

	   menuArrItem = menuList.map((menuItem,index)=>{
	   		return  <g transform={`translate(0,${startstep * index})`} id={menuItem.id} onClick={this.props.onClick}>
	   					<rect fill={'#ffffff'} x={1} y={0} width="165" height="39" />
	   					<text dx={10} dy={22} fontSize={fontSize}  fill={fontColor} > {menuItem.label} </text> 
	   				</g>
	   		
	   })
	   
	   return menuArrItem;
	}

	render(){
		const menuItems=this.addMenuItems();
		const height=40 * menuItems.length;
		return (
				<g transform='translate(20,0)' id="nodeTreeList">
					<rect width="167" height={height} stroke={2} fill={'#cccccc'}/>
					{menuItems}	
				</g>
			)
	}
}

/*const mapDispatchToProps = (dispatch, ownProps) => (
{
  onClick: (e) => {
    dispatch(treeNodeApplyAction(ownProps.nodeId,e.currentTarget.id));
  }
})


export default connect(
	null,
	mapDispatchToProps
 
)(NodeMenuList)*/
