import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { tree } from 'd3-hierarchy';
import  {LinkTree} from '../link/LinkTree';
import  {NodeTree} from '../node/NodeTree';

//import {ENTITIES_BUTTON, RELATIONSHIP_BUTTON,CLASSES_BUTTON} from '../../../constants/ObjectsName'

export const Tree = (props) =>{
    

    /*const checkAddNode = (node)=>{
        switch(node.data.type){
          case 'EntityClass':
            return props[ENTITIES_BUTTON]===false ? false : true;
          case 'Relationship':
            return props[RELATIONSHIP_BUTTON]===false ? false : true;
          case 'OrdinaryClass':
            return props[CLASSES_BUTTON]===false ? false : true;
          case 'ROOT':
          case 'Group':
            return true;
          default:
             return false;
        }

    }*/

    //render(){
    const links=props.links;
    const nodes=props.nodes;
    const windowMode=props.windowMode

    const nodeIndex={};
      //const that=this;

    let nodesChildren=nodes.map((node,i)=>{
        //check multi parent
            
        //if(this.checkAddNode(node) && !nodeIndex[node.data.name]){
          if(!nodeIndex[node.data.name]){
             nodeIndex[node.data.name]=node;
             return <NodeTree id={node.data.name} node={node} nodex={node.x}  nodey={node.y} key={'node_'+i} windowMode={windowMode}/>
          }
          return '';
        
        })

      /*
      * CHECK MULTI PARENT
      */
      let linksChildren=[];

      for (let souceName in nodeIndex){

         const source=nodeIndex[souceName];
        
         source.data.children.map((targetClass,i)=>{
             if(nodeIndex[targetClass.name]){
                let linkData={};
                linkData['target']=nodeIndex[targetClass.name];
                linkData['source']=source;
                const linkId=`${souceName}_${targetClass.name}`

                linksChildren.push( <g className="vx-group" transform="translate(0, 0)" key={linkId}>
                          <LinkTree link={linkData}/>
                      </g>)
             }
         })
      }
      return(
          <g className="vx-group vx-tree" transform="translate(0, 60)" id="treeGraph">
            {linksChildren}
            {nodesChildren}           
          </g>

        )
   // }
}

/*const mapStateToProps = (state,ownProps) => {
  const { elementToggleIsChanged } = state
  return  elementToggleIsChanged
}

export default connect(mapStateToProps)(Tree)*/
