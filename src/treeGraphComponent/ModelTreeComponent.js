import React,{useState,useEffect,useRef} from 'react';
import {Tree} from './graph/graphTree';
import { tree, hierarchy } from 'd3-hierarchy';

import { select as d3Select, selectAll as d3SelectAll, event as d3Event } from 'd3-selection';
import { zoom as d3Zoom } from 'd3-zoom';
import { zoomIdentity as d3ZoomIdentity } from 'd3-zoom';

import { drag as d3Drag } from 'd3-drag';

export const ModelTreeComponent = (props)=>{
    /**
     * Configures zoom upon graph with default or user provided values.<br/>
     * {@link https://github.com/d3/d3-zoom#zoom}
     * @returns {undefined}
     */

    const treeGraphWrapper = useRef(null);
      
    const [startPosition,setStartPosition]=useState(true)
    const [graphData,setGraphData]=useState([]) 

    const [upadateGraph,setTick]=useState(null)

    const [transform, setTransform]=useState();

    const zoomElement=d3Zoom().scaleExtent([0.1, 8]).on('zoom', _zoomed);

   // const [zoomElement, setZoomElement]=useState(startZoom);

    //state={startPosition:false};

    //state.startPosition=true;
        //_onDragMove = _onDragMove.bind(this);

  

    const linkWithD3=true;
    //focusOnNode=focusOnNode.bind(this);
    

    const focusOnNode=(nodeId) =>{

        let node=graphData.get(nodeId);

        if(node){         
            let height=props.height || 500;
            let width=props.width || 1000
            
            const nodeR=200;

            const widthHalf=width/2;
            const startOffset=300;
            
            d3Select('#treeGraphWrapper')
              .transition()
              .duration(1000)
              .tween("zoom", function() {
               return function(t) {
                  var K =1.2
                  var nodeX = widthHalf-(node.x*K);
                  var nodeY= (0 -( (node.y*K)-startOffset));
                  var ts = d3ZoomIdentity//.scale(4)
                   .translate(nodeX, nodeY)
                   .scale(K);

                  d3Select("#treeGraphWrapper").call(zoomElement.transform, ts);
                };
          });

        }      
    }

    
    const startDataProsition =()=>{
      if(props.treeMainGraphObj){

         const mainGraphObj=props.treeMainGraphObj;
          /*
          *return a Map object
          */
          setGraphData(mainGraphObj.descendantsNode);
          setStartPosition(false);
      }  
    }


    const _linkObjectToD3Action = () =>{
        const customNodeDrag = d3Drag()
            .on('start', _onDragStart)
            .on('drag', _onDragMove)
           // .on('end', _onDragEnd);

        d3Select('#treeGraph')
            .selectAll('.node')
            .call(customNodeDrag);//.on("click", _moveToFront);


        //linkWithD3=false;
    }

    useEffect(() => {
         startDataProsition();
         _linkObjectToD3Action();
         if(treeGraphWrapper)_zoomConfig(treeGraphWrapper.current)
    }, [treeGraphWrapper.current])


    

    /*componentDidUpdate(){
        if(linkWithD3)_linkObjectToD3Action();
    }*/

    /**
     * Handles d3 'drag' event.
     * {@link https://github.com/d3/d3-drag/blob/master/README.md#drag_subject|more about d3 drag}
     * @param  {Object} ev - if not undefined it will contain event data.
     * @param  {number} index - index of the node that is being dragged.
     * @param  {Array.<Object>} nodeList - array of d3 nodes. This list of nodes is provided by d3, each
     * node contains all information that was previously fed by rd3g.
     * @returns {undefined}
     */
    const _onDragMove = (ev, index, nodeList) => {
        const id = nodeList[index].id;
        // this is where d3 and react bind
        // graphData is a Map() 
        let draggedNode = graphData[id];

        draggedNode.x += d3Event.dx;
        draggedNode.y += d3Event.dy;

        _tick();
        
    };

    /**
     * The tick function simply calls React set state in order to update component and render nodes
     * along time as d3 calculates new node positioning.
     * @param {Object} state - new state to pass on.
     * @returns {undefined}
     */
    const _tick = () => {
        setTick(Date.now());
    }


   

     /**
       * Handler for 'zoom' event within zoom config.
       * @returns {Object} returns the transformed elements within the svg graph area.
       */
    const _zoomed = () => {
          const transform = d3Event.transform;
        //  transform = d3.event.transform;

          d3SelectAll('#treeGraphContainer').attr('transform', transform);

          setTransform(transform.k)

          //setState({ transform: transform.k });
      };

      const _zoomConfig = (domElement) => {
          //d3Select('#treeGraphWrapper').call(zoomElement.transform, d3ZoomIdentity.translate(props.width/2,50).scale(0.8))
          //d3Select('#treeGraphWrapper').call(zoomElement);
        //d3Select(domElement).call(zoomElement.transform, d3ZoomIdentity.translate(props.width/2,50).scale(0.8))
        
        d3Select(domElement).call(d3Zoom().on("zoom", function(){_zoomed()}));  
        //d3Select(domElement).call(zoomElement);
      

    }


    const _onDragStart = () =>{
        var test;
    }


     /* componentDidMount() {
        _zoomConfig()
      }*/

    /*const shouldComponentUpdate(nextProps, nextState){
        if(nextProps.currentNodeClickedId && nextProps.isSelected){
            _moveNodeToFront(nextProps.currentNodeClickedId);
        }

        if(nextProps.nodeFocusId && nextProps.nodeFocusLastUpdate!==nodeFocusLastUpdate){
           nodeFocusLastUpdate=nextProps.nodeFocusLastUpdate;
           focusOnNode(nextProps.nodeFocusId);
        }
        if(nextProps.resertTreeModelUpdate && nextProps.resertTreeModelUpdate!==props.resertTreeModelUpdate){
          
          // Reset the start position
       
          startDataProsition()
        }
        
        return true;
      }*/

      const _moveNodeToFront = (nodeId)=>{
        const nodeElement=graphData.get(nodeId);
        if(nodeElement){
            graphData.delete(nodeId);
            graphData.set(nodeId,nodeElement);
        }
        linkWithD3=true;
      }

      const onDrop = (e, complete) =>{

        /*let test=e;

        let nodeData=JSON.parse(e.dataTransfer.getData('nodeData'));

        let relativePosx=e.dataTransfer.getData('relativePosx')
        let relativePosy=e.dataTransfer.getData('relativePosy')

        let newObj= Object.assign({},nodeData);

        let currentRelativeMousePosX=e.clientX-370;
        let currentRelativeMousePosY=e.clientY-90;

        relativePosx=relativePosx-50;

        let currentRelativeMousePosX2=currentRelativeMousePosX-parseInt(relativePosx);
        let currentRelativeMousePosY2=currentRelativeMousePosY-relativePosy;

        newObj.x=currentRelativeMousePosX2;
        newObj.y=currentRelativeMousePosY2;
        
        let currentNodes=state.nodes;
        let stateObj={graphData:{}};
        stateObj.graphData[nodeData.data.name]=newObj;
        stateObj['nodes']=currentNodes.push(newObj);

        _tick(stateObj); */

      }

      const onDragOver=(e)=>{

        let test=e
        e.preventDefault();
      }
    
     

      if(startPosition){
        startDataProsition();
      }

      const needRefresh=Date.now();
      const width =props.width;
      const height=props.height;
      const events=false;
     // const margin={ top: 60, left: 0, right: 0, bottom: 110}
      
      return (
            
            <div width={width} height={height} id={'treeGraphWrapper'} 
                onDragOver={(e)=>onDragOver(e)}
                onDrop={(e)=>onDrop(e, "complete")}
                ref={treeGraphWrapper}
                >

              <svg width={width} height={height}>
                <g id={'treeGraphContainer'} >               
                  <rect 
                    opacity={0}
                    width={width}
                    height={height}
                    fill="#ffffff"
                  />
                  <Tree id={'treeGraph'}
                    needRefresh={needRefresh}
                    nodes={[...Object.values(graphData)]}
                    //windowMode={state.windowMode}
                  />
                </g>
              </svg>
            </div>
        )
    //}
}

/*const mapStateToProps = (state, ownProps) => {
  const mainGraphIsChanged = state.mainGraphIsChanged || {}
  const actionsObj = mainGraphIsChanged.actionsObj || {}

  let resertTreeModelUpdate;
  if(actionsObj['resetTreeModel']){
      resertTreeModelUpdate=actionsObj['resetTreeModel'].lastUpdated;
  }

  let isSelected=false;
  let nodeFocusLastUpdate;
  const {lastTreeNodeClicked,nodeToFocus}=state || {lastTreeNodeClicked:{},nodeToFocus:{}};

  let currentNodeClickedId=null;
  if(lastTreeNodeClicked.nodeId){
      isSelected=lastTreeNodeClicked.toBeSelected;
      currentNodeClickedId=lastTreeNodeClicked.nodeId
  }
  if(nodeToFocus.nodeFocusId){
    nodeFocusLastUpdate=nodeToFocus.lastUpdated;
  }

  return {resertTreeModelUpdate,isSelected,currentNodeClickedId,nodeFocusLastUpdate,nodeFocusId:nodeToFocus.nodeFocusId}
}

export default connect(
  mapStateToProps
)(ModelTreeComponent)*/




