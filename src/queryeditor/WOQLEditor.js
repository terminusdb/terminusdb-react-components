import React from "react"
import PropTypes from "prop-types";
import { CodeEditor, CodeViewer } from './Editor'
import {LanguageSwitcher} from "./LanguageSwitcher"
import {COMMIT_BOX, QUERY_EDITOR_LABEL  } from "./constants.querypane"
import {makeWOQLFromString , makeWOQLIntoString} from "./queryPaneUtils"
/**
 * Controls the display of query viewer and editor
 */
export const WOQLEditor = ({language, content, editable, setEditorContent, setMainError, setWOQLQuery}) => {
    
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
        const woql=checkContent();
        if(woql){
            if(setWOQLQuery) setWOQLQuery(woql)
        }
    }

    /*
    * onBlur
    */
    function checkContent(){
        //sets errors internally if doesn't work
        setMainError(false)
        if(content){
            try{
                const woql = makeWOQLFromString(content, language)
                /*
                * check if the query is an update query and need a commitSMS
                */
                // setContainsUpdate(woql.containsUpdate())
                return woql
            }catch(err){
                console.log(err)
                setMainError(err)
                return false;
            }
            
        }
        return false
    }


    return(
        <>
        { editable &&
            <CodeEditor  onBlur={onBlur} text={content} language={language}/>
        }
        {!editable &&
            <CodeViewer text={content} language={language}/>
        }
        </>
    )
}

