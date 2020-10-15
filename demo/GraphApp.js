import React, {useState,useEffect} from 'react';

import {WOQLGraph} from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client'
import person from './person-graph.json';
import bike from './bike-data.json';
import seshat from './seshat-data.json';
/*
*  
*/
export const GraphApp= (props) =>{

  const [reload,setReload] = useState(false)
  const [myviewer, setConfig] = useState(undefined);
  const WOQL = TerminusClient.WOQL;

  let resultData={};

   
	const server=process.env.API_URL;
  const key=process.env.API_KEY
  const db=process.env.API_DB

  console.log("server",server,'db',db)

  const woqlGraphConfig= TerminusClient.View.graph();
  woqlGraphConfig.height(500).width(800)
  woqlGraphConfig.literals(false);

  if(window.location.search.endsWith('bike')){
      resultData=bike;

  }else if(window.location.search.endsWith('seshat')){

      resultData=seshat;

      woqlGraphConfig.edges(["v:Predecessor", "v:Polity"], ["v:Polity", "v:Successor"])
      woqlGraphConfig.node("v:Predecessor").text("v:Plab").icon({label: true, color:[0,0,0]})
      woqlGraphConfig.node("v:Successor").text("v:Slab").icon({label: true, color:[0,0,0]}).color([148, 103, 189])
      
      woqlGraphConfig.node("v:Polity").text("v:Lab").icon({label: true, color:[0,0,0]}).size(20).color([188, 189, 34])
      woqlGraphConfig.node("v:Polity", "v:Presence").in("terminusdb:///schema#absent").color([23, 190, 207])
      woqlGraphConfig.node("v:Polity", "v:Presence").in("terminusdb:///schema#present").color([31, 119, 180])
      //woqlGraphConfig.node("v:Polity", "v:Presence").in("scm:unknown").color([102, 255, 255])

  }else{
      resultData=person;
      woqlGraphConfig.node("Mother").text("Mother_Name").color([60, 219, 11])//.size(10)

      woqlGraphConfig.node("Mother","Mother_Name").in("motherOfMaria01").color([255, 0, 255])//.size(10)

      woqlGraphConfig.node("Person").text("Name").color([255, 219, 11]).size(30)

  }
  
   let result;
   
  

  // woqlGraphConfig.node("Person").in("terminusdb:///data/Person_Maria01_25/05/2011").color([255, 0, 255])

   //woqlGraphConfig.node("Name").hidden(true)
   //woqlGraphConfig.node("Mother_Name").hidden(true)




   //woqlGraphConfig.edges(["Person","Mother"]).color([255, 44, 11])


  /* view.edges(["v:Predecessor", "v:Polity"], ["v:Polity", "v:Successor"])
  view.node("v:Predecessor").text("v:Plab").icon({label: true})
  view.node("v:Successor").text("v:Slab").icon({label: true})
  view.node("v:Polity").text("v:Lab").icon({label: true})
  view.node("v:Polity", "v:Presence").in("scm:absent").color([255,0,0])
  view.node("v:Polity", "v:Presence").in("scm:present").color([0,255,0])
  view.node("v:Polity", "v:Presence").in("scm:unknown").color([150,150,150])*/

   useEffect(() => {
            
      result = new TerminusClient.WOQLResult(resultData);

      let viewer = woqlGraphConfig.create(null);

      viewer.setResult(result);
      setConfig(viewer)
         /*}).catch((err)=>{
            console.log(err)
         //})

      }).catch((err)=>{
         console.log(err)
      })*/
   },[reload])


  if(myviewer)console.log("____CONFIG____", myviewer.config);

	return (<div style={{border:'1px solid'}}>
				GRAPH COMPONENT {reload}
				{myviewer && <WOQLGraph
                    config={myviewer.config}
                    dataProvider={myviewer}/>}

			</div>)

}

