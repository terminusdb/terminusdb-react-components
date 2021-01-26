import * as NODE_ACTION_NAME from './actionType'
import {UTILS} from "@terminusdb/terminusdb-client"

export const removeElementToArr=(arrayList,elementName)=>{
    if(!arrayList)return undefined
    const index=arrayList.findIndex(function(item){return item===elementName || item.name===elementName})
    if(index>-1){
        arrayList.splice(index,1);
        return elementName;
    }
    return undefined;
}

export const getNewNodeTemplate=(name=null,type=null,label="NEW NODE",comment="",)=>{
	const nodeId= name ?  UTILS.shorten(name) : ""
    const nodeName= name || `CLASS_${(new Date()).getTime()}`;
    const newObj = {
                     name:nodeName,
                     id: nodeId,
                     label:label,
                     comment:comment,
                     parents:[],
                     newElement:true,
                     children:[],
                     type:type,
                     allChildren:[],
                     abstract:false
                    }
    if(name!==null)newObj['newElement']=false;
	return newObj;
}

export const treeModelApplyAction=(nodeName,actionName,graphData,nodeIndex)=>{
    if(!nodeName)return false;


            
            //const newName='new_'+index_newObj++;
            const currentNode=this.state.graphData[nodeName];


            const currentDataProviderNode=this.nodeIndex[nodeName];

            const indexNewObj={name: newName, "label": "NEW NODE", type:'node',type:currentNode.data.type};

            if(actionName===NODE_ACTION_NAME.ADD_NEW_ENTITY){
               indexNewObj.type='EntityClass';
               actionName=NODE_ACTION_NAME.ADD_CHILD;

             }else if(actionName===NODE_ACTION_NAME.ADD_NEW_CLASS){
               indexNewObj.type='OrdinaryClass';
               actionName=NODE_ACTION_NAME.ADD_CHILD;
             }
             //else if(actionName===NODE_ACTION_NAME.ADD_NEW_RELATIONSHIP){
               // indexNewObj.type='Relationship';
               // actionName=NODE_ACTION_NAME.ADD_CHILD;
             //}
            //this.nodeIndex[newName]=indexNewObj;
            switch (actionName ){ 
              case NODE_ACTION_NAME.ADD_CHILD:

                newObj.parent=currentNode
                newObj.data=indexNewObj //{"name": newName, "label": "NEW NODE"}
                newObj.depth=currentNode.depth+1;
                newObj.x=currentNode.x-100;
                newObj.y=currentNode.y+100;


                if(!currentNode.children)currentNode.children=[];
                currentNode.children.push(newObj);
                this.state.graphData[newName]=newObj;

                if(!currentDataProviderNode.children)currentDataProviderNode.children=[];
                currentDataProviderNode.children.push(indexNewObj);
                this.nodeIndex[newName]=indexNewObj

                this.state.dataEdges[currentNode.data.name+'_'+newObj.data.name]={source:currentNode.data.name,target:newObj.data.name}

                this.state.nodes.push(newObj);
                break;

              case NODE_ACTION_NAME.ADD_PARENT:

                 const parentObj=currentNode.parent;

                 //const parentObj=this.state.graphData[parentName];
                 
                 parentObj.children.push(indexNewObj);

                 this._removeLink(currentNode.parent,currentNode);
                 newObj.data=indexNewObj;//{"name": newName, "label": "NEW NODE"}
                 newObj.depth=currentNode.depth;
                 newObj.x=currentNode.x-100;
                 newObj.y=currentNode.y-100;
                 newObj.children=[];
                 newObj.children.push(currentNode);
                 newObj.parent=currentNode.parent;
                 currentNode.parent=newObj;
                 currentNode.depth=newObj.depth+1;

                this.state.graphData[newName]=newObj;

                
                //currentDataProviderNode

                const currentParentDatap=this.nodeIndex[currentDataProviderNode.parent];

                /*remove the old choldren*/
                const currentParentDatapTmp=currentParentDatap.children.filter(dataItem => dataItem.name !== nodeName);
                
                currentParentDatap.children=currentParentDatapTmp;
                currentParentDatap.children.push(indexNewObj);


                indexNewObj.children=[];
                indexNewObj.children.push(currentDataProviderNode);

                this.nodeIndex[currentNode.parent]=currentParentDatapTmp;
                this.nodeIndex[newName]=indexNewObj

                
                if(this.state.dataEdges[parentObj.data.name+'_'+currentNode.data.name]){
                  delete this.state.dataEdges[parentObj.data.name+'_'+currentNode.data.name];
                }
                this.state.dataEdges[newObj.data.name+'_'+currentNode.data.name]={source:currentNode.data.name,target:newObj.data.name}
                this.state.dataEdges[parentObj.data.name+'_'+newObj.data.name]={source:parentObj.data.name,target:newObj.data.name}

                this.state.nodes.push(newObj);
                break;

            }

}

