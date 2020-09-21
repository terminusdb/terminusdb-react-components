import { tree, hierarchy } from 'd3-hierarchy';

export const FormatData =(dataProvider)=>{

	let _rootIndexObj={ROOT:{"name": "ROOT", type:'ROOT', "label":"Main Graph", "children":[],"comment":'ROOT'},

					   		OrdinaryClasses:{name:"OrdinaryClasses",type:"Group",
										    label:"Ordinary Classes ","children":[],comment:'Ordinary Classes'},
		               		DocumentClasses:{name:'DocumentClasses',
		                              type:"Group",label:"Document Classes","children":[],comment:'Document Classes'}}



	_rootIndexObj.descendantsNode={};	                             
	_rootIndexObj.ROOT.children.push(_rootIndexObj.OrdinaryClasses);
	_rootIndexObj.ROOT.children.push(_rootIndexObj.DocumentClasses);
	                             
	addElements(_rootIndexObj.OrdinaryClasses,_rootIndexObj.DocumentClasses,dataProvider)

	///formatDataForTreeChart(_rootIndexObj);

	const treeModel = tree();
		 /*
          * When you set a size for the tree,Vtree$$1.size(size); 
          * you are setting a fixed size so that the tree has to conform to that width and height.  
          * When you set a nodeSize, the tree has to be dynamic so it resets the size of the tree.
          */

    treeModel.nodeSize([150,400]);
         
    const data=hierarchy(_rootIndexObj.ROOT);
    const d3Data = treeModel(data);
     
     _rootIndexObj.treeNode=d3Data.descendants();

	//this._descendantsNode=new Map();
    for(let node of  _rootIndexObj.treeNode){
       /*if(node.data.type==='Group' && node.x && Math.abs(node.x)<200){
       		node.x=node.x*2;
       		//node.y=node.y/1.5;
       }*/
       _rootIndexObj.descendantsNode[node.data.name]= node;  
    }
	return _rootIndexObj;
}

/*
* "Abstract": {
	"@type":"http://www.w3.org/2001/XMLSchema#string",
	"@value":"No"
      },
      "Children": {"@type":"http://www.w3.org/2001/XMLSchema#string", "@value":""},
      "Class ID":"terminusdb:///schema#CitedWork",
      "Class Name": {"@language":"en", "@value":"Cited Work"},
      "Description": {"@type":"http://www.w3.org/2001/XMLSchema#string", "@value":""},
      "Parents": [ ["http://terminusdb.com/schema/system#Document" ] ]

*/

const getLabel=(item) =>{
	if(item['Class Name']['@value']){
		return item['Class Name']['@value']
	}
	const classId=item['Class ID'];
}

const addElements=( OrdinaryClassesObj, DocumentClassesObj, dataProvider=[])=>{

	const elementsObject={}

	dataProvider.bindings.forEach((item)=>{
		const classId=item['Class ID'];
		const label=getLabel()
		const description=item['Description']['@value'];
		const abstract=item['Abstract']['@value'];
		/*
		"Parents": {"@type":"http://www.w3.org/2001/XMLSchema#string", "@value":""}
		*/
		if(!elementsObject[classId]){
			elementsObject[classId]={}		
			elementsObject[classId]['children']=[];
			elementsObject[classId]['name']=classId;	
		}

		elementsObject[classId]['abstract']=abstract;		
		elementsObject[classId]['label']=label;
		elementsObject[classId]['comment']='test';

		//add for children
		if(Array.isArray(item['Parents'])){
			const parentNum=item['Parents'].length;

			item['Parents'].forEach((parent)=>{

				const parentId=parent[0]
				//if parent is document type is 'DocumentClass'

				if(parentId==='http://terminusdb.com/schema/system#Document'){
					elementsObject[classId]['type']='DocumentClass'
					if(parentNum===1){
						DocumentClassesObj.children.push(elementsObject[classId])
					}
				//if get type from the parent
				}else if(elementsObject[parentId] && elementsObject[parentId]['type']){
					//if(!elementsObject[classId]['type']){
					//const parentType=elementsObject[parentId].type;
					elementsObject[classId]['type']=elementsObject[parentId].type;
					//}
				}
			})
		}else{
			elementsObject[classId]['type']='ObjectClass';
			OrdinaryClassesObj.children.push(elementsObject[classId]);
		}

		//add for children
		if(Array.isArray(item['Children']) ){//&& classId==="terminusdb:///schema#Organization"){
			item['Children'].forEach((child)=>{
				const childId=child[0];
				if(!elementsObject[childId]){
					elementsObject[childId]={}
					elementsObject[childId]['name']=childId
					elementsObject[childId]['children']=[]
				}

				if(elementsObject[classId].type){
					elementsObject[childId]['type']=elementsObject[classId].type;
				}
				

				//add child to the current node
				elementsObject[classId]['children'].push(elementsObject[childId])


			})

		}
	})
}


