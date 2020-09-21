import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import {FormatData,ModelTreeComponent} from '@terminusdb/terminusdb-react-components';
import bike from './bike.json';
import seshat from './testData.json';
import seshat_sub from './seshat_sub.json';
import { SizeMe } from 'react-sizeme' 

import {TimelineCommits} from '@terminusdb/terminusdb-react-components';
//import DataProvider from './resources/content';
//import DataProvider from './resources/CommitBinding'
import TerminusClient from '@terminusdb/terminusdb-client'

export const App = (props) =>{

    const [treeMainGraphObj,setGraphObj] =useState(null)

    console.log("___URL__",process.env.API_URL,process.env.API_KEY);
    /*
    * if I set user and not organization I get false in the url
    */
    const woqlClient=new TerminusClient.WOQLClient(process.env.API_URL,{user:'admin',
                                     organization:'admin',
                                     key:process.env.API_KEY,db:process.env.DB_NAME})
    let testData=seshat

    if(window.location.search.endsWith('bike')){
      testData=bike;
    }else if(window.location.search.endsWith('seshat_sub')){
       testData=seshat_sub;
    }

    useEffect(() => {
        const treeMainGraphObj=FormatData(testData);
        setGraphObj(treeMainGraphObj);
    },[])

    return (
        <div className="console__page">
          <SizeMe monitorHeight={true}>{({ size }) =>
            <div style={{ minHeight:"400px", height: "calc(100vh - 10px)"}}>
              {treeMainGraphObj && <ModelTreeComponent width={size.width} height={size.height} treeMainGraphObj={treeMainGraphObj}/>}
              </div>
              }
           </SizeMe>
        </div>    
    )
}

/*
 <div classNameName="history__nav">
              <TimelineCommits  woqlClient={woqlClient}/>
            </div>*/

export default App;
                   