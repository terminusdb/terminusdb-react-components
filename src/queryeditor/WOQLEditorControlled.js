import React, {useState } from "react";
import {WOQLEditor} from "./WOQLEditor"
import {LanguageSwitcher} from "./LanguageSwitcher"
import {useEditorControl} from "./hook/useEditorControl"

//language, content, setMainError, setWOQLQuery, editable
/**
 * allow you to do use a query editor with multi language
 *
 * @param {WOQLQuery object} 
 * @param {String}           - startLanguage type
 * ..
 */
export const WOQLEditorControlled = ({query, startLanguage, initcontent, editable, languages,setWOQLQuery,mainError}) => {

    const {changeEditableLanguage,
            changeCurrentLanguage,
            editorContent,
            editorLanguage,
            isEditable,
            changeEditorContent,
            showEditableButton} = useEditorControl(startLanguage, mainError, initcontent, editable); 
   
   return ( <div className="tdb__qpane__editor" >
            <div className="tdb__commit__bar" >
                <div className="tdb__commit__bar__tools">
                    <LanguageSwitcher
                        currentLanguage ={editorLanguage}
                        showEditButton={showEditableButton} 
                        languages={languages} 
                        onChange={changeCurrentLanguage} 
                        onEdit={changeEditableLanguage}
                    />
                </div>
           </div>
           <WOQLEditor
                setEditorContent={changeEditorContent}
	           	content={editorContent}
	           	language={editorLanguage}
	           	editable={isEditable}
	           	setMainError={mainError}
	           	setWOQLQuery={setWOQLQuery}
           />
        </div>)
}
