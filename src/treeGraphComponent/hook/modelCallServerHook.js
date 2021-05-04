import React, {useState,useEffect} from "react";
import MainGraphObject from "../MainGraphObject"
import TerminusClient from '@terminusdb/terminusdb-client'

export const modelCallServerHook = (woqlClient,branch,ref) => {

	const [mainGraphDataProvider, setResultMainGraph] = useState({classesResult:null,
																  propsResult:null,
																  restResult:null});
	const [reloadGraph, setReloadGraph] = useState(null);

	const [callServerLoading, setLoading] = useState(false);

	const [reportMessage, setReport] = useState(false);


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
				/*
				* CLEANING THE CARDINALITY NOT Linked WITH PROPERTY
				*/
				cleaningCardinality().then((value) => {
					//do nothing
				}).catch(err=>{
					console.log(err.message)
				}).finally(()=>{
					setResultMainGraph({classesResult:results[0],propsResult:results[1],restResult:results[2]})			
				})	
				
			}).catch(err=>{
				//setReport(err.message)
			}).finally(()=>{setLoading(false)})
			
    		
    	}
    	if(woqlClient)loadGraphData()
   		//Promise.all([someCall(), anotherCall()]).then((results)=>{

	}, [reloadGraph,branch,ref])

	//lets see how use it
	async function cleaningCardinality() {
		try {
			const WOQL = TerminusClient.WOQL;
			const card = WOQL.quad("v:Element", "type", "owl:Restriction", "schema/main").not().quad("v:Element", "owl:onProperty", "v:prop", "schema/main");
			const result = await woqlClient.query(card);
			if (result && result.bindings.length > 0) {
				const query = [];
				result.bindings.forEach((item, index) => {
						const elementName = item.Element
						query.push(WOQL.delete_class(elementName, "schema/main", `v:varName__${index}`));
						query.push(WOQL.opt(
							WOQL.quad(`v:dom__${index}`, "rdfs:subClassOf", `v:sub__${index}`, "schema/main").eq(`v:sub__${index}`, `${elementName}`)
								.delete_quad(`v:dom__${index}`, "rdfs:subClassOf", `v:sub__${index}`, "schema/main")
						));
					});

					await woqlClient.query(WOQL.and(...query));
			}
		} catch (err) {
			console.log("__CARDINALITY__ERROR__", err);
		}
	}
	
	const saveGraphChanges=(query,commitMessage)=>{
		if(query!==undefined){
			let ts = Date.now()
			setLoading(true)
			const commitM=commitMessage || "Update from model builder"
			woqlClient.query(query,commitM).then(result=>{				
				let msg = `Successfully updated schema graph`
	            setReport({
	                status: 'success',
	                message:  msg,
	                time: Date.now() - ts,
				})
				
	            setReloadGraph(Date.now())
			}).catch(err=>{
				//setError(err.message)
				let rep = {status: 'error', error: err}
                let failureMessage = `Failed to load schema graph`
                //setReport({failure: failureMessage, report: rep})


                setReport({
	                status: "error",
	                message: `Failed to update schema graph`,
	                error: err,
	                time: Date.now() - ts,
            	})
			}).finally(()=>{
				setLoading(false)
			})
		}
	}

	const resetReport=()=>{
		setReport(false)
	}

	
	return {
        mainGraphDataProvider,
        saveGraphChanges,
        reportMessage,
        callServerLoading,
        resetReport
    }
}	

