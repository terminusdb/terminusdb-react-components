import React, {useState,useEffect} from "react";
import TerminusClient from '@terminusdb/terminusdb-client';
import { format } from "date-fns";
const DATETIME_FULL = "hh:mm:ss, dd/MM/yy"

export const useCommitsControl = (woqlClient, setError, branch='master', currentStartTime=null, page=0, limit=10) => {

    const WOQL = TerminusClient.WOQL
    const [currentPage, setCurrentPage] = useState(page); 
    const [dataProvider, setDataProvider] = useState([]);
    const [startTime, setUpdateStartTime] = useState(currentStartTime);  
    //const [selectedValue,setSelectedValue] = useState(0);
    const [gotoPosition,setGotoPosition] = useState(null);

    const [dataProviderValues,setDataProviderValues] = useState({dataProvider:[],selectedValue:0})

    const setSelectedValue=(value)=>{
        const newValue={dataProvider:dataProviderValues.dataProvider,
                        selectedValue:value}
        setDataProviderValues(newValue)
    }   
    /*
    * move the commit search from time
    */
    const getPage=()=>{
        return limit*currentPage
    }

    const setStartTime=(time)=>{
        setCurrentPage(0);        
        setGotoPosition(null)     
        setUpdateStartTime(time)
    }

    /*
    *the result the first is the last commit the last last is the older     
    */
    
    //load commit Count
    useEffect(() => {//WOQL.eq("v:Branch","master"),
        //start from
        const vals = startTime ? WOQL.not().greater('v:Time', startTime) : false
        const q = WOQL.lib().commits().and(WOQL.eq("v:Branch",branch))
        if (vals) q.and(vals)

        const latest_woql = WOQL.limit(limit).start(getPage())
           .select('v:Time', 'v:Author', 'v:Message','v:Commit ID','v:Parent ID')
           .order_by('v:Time desc', q)

        woqlClient.query(latest_woql).then((result) => {
            if (result.bindings) {
                const lastIndex=Math.max(result.bindings.length-1,0)
                const dataP=formatResult(result.bindings);
                let newPoss=null
                let selVal=lastIndex
                /*
                * if I have the time set and I'm in the first page
                * I'm not in append mode
                */
                if(startTime && currentPage===0){
                    newPoss=lastIndex;
                }
                if(currentPage>0){
                    selVal=dataProviderValues.selectedValue + lastIndex + 1
                }
                setDataProviderValues({dataProvider:dataP,selectedValue:selVal})            
                setGotoPosition(newPoss)               
            }
        }).catch((err)=>{
            if(setError)setError(err);
            console.log(err);
        })
    }, [currentPage,startTime])

    /*
    * the result comes order by time so the first is the last commits.
    * we need to reverse the array for the time travel 
    * (the last in the right position must be the last in the array),
    * the 0 post have to be the oldest of the result commits
    */
    
    const formatResult=(result)=>{
        let dataP=[];
        if(currentPage>0){
            dataP=dataProviderValues.dataProvider;
        }else{
            result.reverse();
        }
        result.forEach((entry,index)=>{
               const datetime=entry.Time['@value'] * 1000;
               const item={datetime:datetime,
                            label:format(new Date(datetime),DATETIME_FULL),
                            message:entry['Message']['@value'],
                            commit:entry['Commit ID']['@value'],
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
        return dataP;
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