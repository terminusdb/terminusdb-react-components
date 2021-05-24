import React, {useEffect, useState} from "react"
import PropTypes from "prop-types";
import { CodeEditor, CodeViewer } from './Editor'
import {LanguageSwitcher} from "./LanguageSwitcher"
import {COMMIT_BOX, QUERY_EDITOR_LABEL  } from "./constants.querypane"
import {makeWOQLFromString , makeWOQLIntoString} from "./queryPaneUtils"
/**
 * Controls the display of query viewer and editor
 */
export const WOQLEditor = ({language, content, editable, setEditorContent, setMainError, setWOQLQuery, theme}) => {


    WOQLEditor.propTypes = {
        language:PropTypes.string,
        content:PropTypes.string,
        setMainError:PropTypes.func,
        setWOQLQuery:PropTypes.func,
        setEditorContent:PropTypes.func.isRequired,
        editable:PropTypes.bool
    }

    WOQLEditor.defaultProps = {
        content: '',
        language:"js",
        editable:true
    };


    function onBlur(value){
        /*
        *save the editor string
        */
        setEditorContent(value);
        const woql=checkContent(value);
        if(woql){
            if(setWOQLQuery) setWOQLQuery(woql)
            //let wqc = makeWOQLIntoString(woql, "js")
        }
    }
    /*
    * onBlur
    */
    function checkContent(content){
        //sets errors internally if doesn't work
        if(setMainError) setMainError(false)
        if(content){
            try{
                const woql = makeWOQLFromString(content, language)
                /*
                * check if the query is an update query and need a commitSMS
                */
                // setContainsUpdate(woql.containsUpdate())

                //console.log("initcontent into js", makeWOQLIntoString(woql, "js"))

                return woql
            }catch(err){
                console.log(err)
                if(setMainError) setMainError(err)
                return false;
            }

        }
        return false
    }




    return(
        <>
        { editable && !content &&
            <CodeEditor  onBlur={onBlur}  language={language} theme={theme}/>
        }
        { editable && content &&
            <CodeEditor  onBlur={onBlur} text={content} language={language} theme={theme}/>
        }
        {!editable &&
            <CodeViewer text={content} language={language} theme={theme}/>
        }
        </>
    )
}

/*
return(
    <>
    { editable && !content &&
        <CodeEditor  onBlur={onBlur}  language={language}/>
    }
    { editable && content &&
        <CodeEditor  onBlur={onBlur} text={content} language={language}/>
    }
    {!editable &&
        <CodeViewer text={content} language={language}/>
    }
    </>
)
*/
