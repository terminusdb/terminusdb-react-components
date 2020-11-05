import React, {useState,useEffect} from "react";
import MainGraphObject from "../MainGraphObject"
import TerminusClient from '@terminusdb/terminusdb-client'

/*and(
     opt().triple("doc:test", "label", "v:label").delete_triple("doc:test", "label", "v:label"),
     add_triple("doc:test", "label", "New label")
)
 //appearance
   15  /*
   16: add_quad("MyClass", "subClassOf", "Parent", "schema/main")
   17: delete_quad("MyClass", "subClassOf", "Parent", "schema/main")
   18  
*/

export const modelCallServerHook = (woqlClient,branch,ref) => {

	const [mainGraphDataProvider, setResultMainGraph] = useState({classesResult:{},
																  propsResult:{},
																  restResult:{}});
	//const [resultProperties, setResultProperties] = useState({});

	//const [resultResctiction, setResultRestriction] = useState([]);

	const [reloadGraph, setReloadGraph] = useState(null);

	const [callServerLoading, setLoading] = useState(false);

	const [callServerError, setError] = useState(false);

	//const [reloadGraph, setReloadGraph] = useState(null);


	



	/*
	* create the mainGraphObject and format the data
	*/
	useEffect(() => {
		const loadGraphData=()=> {
			setLoading(true)
			const classQuery = TerminusClient.WOQL.lib().classesAndChoices();
    		//const classesResult = await woqlClient.query(classQuery);

    		const propsQuery = TerminusClient.WOQL.lib().properties();
    		//const propsResult = await woqlClient.query(propsQuery);

    		const restictions = TerminusClient.WOQL.quad("v:Restriction", "type", "owl:Restriction", "schema/main").
											quad("v:Restriction", "owl:onProperty", "v:Property", "schema/main").
											and(
												TerminusClient.WOQL.opt().quad("v:Restriction", "owl:cardinality", "v:cardinality", "schema/main"),
												TerminusClient.WOQL.opt().quad("v:Restriction", "owl:maxCardinality", "v:max", "schema/main"),
												TerminusClient.WOQL.opt().quad("v:Restriction", "owl:minCardinality", "v:min", "schema/main")
											)
			//const restResult = await woqlClient.query(restictions);

			Promise.all([woqlClient.query(classQuery), woqlClient.query(propsQuery), woqlClient.query(restictions)]).then((results)=>{
				setResultMainGraph({classesResult:results[0],propsResult:results[1],restResult:results[2]})
			}).catch(err=>{setError(err.message)})
			.finally(()=>{setLoading(false)})
			
    		
    	}
    	if(woqlClient)loadGraphData()
   		//Promise.all([someCall(), anotherCall()]).then((results)=>{

	}, [reloadGraph,branch,ref])

	
	const saveGraphChanges=(query)=>{
		if(query!==undefined){
			setLoading(true)
			woqlClient.query(query).then(result=>{
				setReloadGraph(Date.now())
			}).catch(err=>{
				setError(err.message)
			}).finally(()=>{
				setLoading(false)
			})
		}
	}

	
	return {
        mainGraphDataProvider,
        saveGraphChanges,
        callServerError,
        callServerLoading
    }
}	

