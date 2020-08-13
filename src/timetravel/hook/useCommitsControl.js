import React, {useState,useEffect} from "react";
import TerminusClient from '@terminusdb/terminusdb-client';
//import { format } from "date-fns";
import moment from 'moment'; 
const DATETIME_FULL = "hh:mm:ss, DD-MM-YYYY"

export const useCommitsControl = (woqlClient, setError, branch='main', currentStartTime=null, currentCommit=null, firstCommit=null, limit=10,page=0) => {

    const WOQL = TerminusClient.WOQL
    const [currentPage, setCurrentPage] = useState(page); 
   // const [commit, setCurrentCommit] = useState(currentCommit); 
    //const [dataProvider, setDataProvider] = useState([]);
    const [startTime, setUpdateStartTime] = useState(currentStartTime);  
    const [gotoPosition,setGotoPosition] = useState(null);

    const [dataProviderValues,setDataProviderValues] = useState({dataProvider:[],selectedValue:0})

    const setSelectedValue=(value)=>{
        const newValue={dataProvider:dataProviderValues.dataProvider,
                        selectedValue:value}
        setDataProviderValues(newValue)
    }   
    /*ss
    * move the commit search from time
    */
    const getPage=()=>{
        return limit*currentPage
    }

    const setStartTime=(time)=>{
        setCurrentPage(0);        
        setGotoPosition(null)
        //setCurrentCommit(null)     
        setUpdateStartTime(time)
    }

    /*
    *the result the first is the last commit the last last is the older     
    */
    //next_commits
    //previous_commits
    
    //load commit Count
    /*
    * first render
    * commit ref or is the last commit
    */
    useEffect(() => {//WOQL.eq("v:Branch","master"),
        //start from
        let queryObj = WOQL.query()
        if(currentCommit){
            queryObj = WOQL.lib().commit_timeline(currentCommit, branch, limit)
        }else {
            queryObj.and(
                WOQL.lib().active_commit_id(branch, startTime, "Active Commit ID"),
                WOQL.lib().commit_timeline("v:Active Commit ID", branch, limit)
            )
        }
  
        woqlClient.query(queryObj).then((result) => {
            if (result.bindings) {                
                const dataFormatted=formatResult(result.bindings);
                let newPoss=null
                let selVal=dataFormatted.toBeSelect;
                /*
                * if I have the time set and I'm in the first page
                * I'm not in append mode
                */
                //if(startTime && currentPage===0){
                newPoss=selVal;
                //}
                if(currentPage>0){
                    selVal=dataProviderValues.selectedValue + dataFormatted.toBeSelect + 1
                }
                setDataProviderValues({dataProvider:dataFormatted.dataP,selectedValue:selVal})            
                setGotoPosition(newPoss)               
            }
        }).catch((err)=>{
            if(setError)setError(err);
            console.log(err);
        })
    }, [currentPage,startTime, branch, currentCommit])

    /*
    * the result comes order by time so the first is the last commits.
    * we need to reverse the array for the time travel 
    * (the last in the right position must be the last in the array),
    * the 0 post have to be the oldest of the result commits
    */
    
    const formatResult=(result)=>{
        let dataP=[];
        let toBeSelect= Math.max(result.length-1,0)
               
        if(currentPage>0){
            dataP=dataProviderValues.dataProvider;
        }else{
            result.reverse();
        }
        result.forEach((entry,index)=>{
               const time=entry.Time['@value'] //* 1000;
               const commitValue=entry['Commit ID']['@value'];

               if(currentCommit && currentCommit===commitValue)toBeSelect=index;

               const item={ datetime:time * 1000,
                            time: time,
                            label:moment.unix(time).format(DATETIME_FULL),
                            message:entry['Message']['@value'],
                            commit:commitValue,
                            author:entry['Author']['@value'],
                            parent:entry['Parent ID']['@value']
                        }
                if(currentPage>0){
                    /*
                    *I need to prepend if already I have some data
                    */
                    dataP.unshift(item)
                }else{
                    dataP.push(item)
                }
        })
        return {dataP:dataP,toBeSelect:toBeSelect};
    }

    const loadNextPage=(obj)=>{
       // {lastPosition:positionValue,maxPosition:maxPosition}
       setCurrentPage(currentPage+1)
    }

    return {
        dataProviderValues,
        gotoPosition,
       // dataProvider,
       // selectedValue,
        startTime,
        setStartTime,
        setSelectedValue,
        loadNextPage,//:()=>{setCurrentPage(currentPage+1)}       
    }
}