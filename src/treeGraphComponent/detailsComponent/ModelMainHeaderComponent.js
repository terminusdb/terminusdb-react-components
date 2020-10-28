import React from 'react';
import {ToogleButton} from './ToogleButton';
import {TOOLBAR_LABELS} from '../../constants/details-labels';

export const ModelMainHeaderComponent =(props)=>{
//<PagesLink/>
	//render(){
		const viewEdit=props.isEditMode===true ? true : false;
		let style={style:{display:'none'}}
		if(viewEdit){
			style={}
		}

		return(		
		   <div className="tdb__model__hright">
		   	   <div className="tdb__model__hright" {...style}>
			   	   {/*<div className="icon-header">
				   		<i className="fa fa-sync" title={TOOLBAR_LABELS.ResetButtonTooltip} onClick={props.resetTreeModel}></i>
				   </div>*/}
				   <div className="icon-header" >
				   		<ToogleButton baseTooltip={TOOLBAR_LABELS.SaveButtonTooltip} 
				   					  baseIcon="fa fa-save"
				   					  selectIcon="fa fa-save"
				   					  selectClassName="tdb__button__base tdb__panel__button"
				   					  name="SAVE_BUTTON" onSelectionChange={props.saveData}/>
				   </div>
				   {/*
				   <div className="icon-header" > 
				   		<i className="fa fa-undo" title={TOOLBAR_LABELS.UndoButtonTooltip} onClick={props.undoAction}></i>
				   </div>
				   <div className="icon-header" >
				   		<i className="fa fa-redo" title={TOOLBAR_LABELS.RedoButtonTooltip}  onClick={props.redoAction}></i>
				   </div>*/}
			   </div>
			   <div className="icon-header">
			   	  <ToogleButton	 onSelectionChange={props.changeMode}
		   	   					 baseTooltip={TOOLBAR_LABELS.EditModeTooltip}
		   	                     selectedTooltip={TOOLBAR_LABELS.ViewModeTooltip} 
		   	                     name="MODEL_RIGHT_WINDOW_OBJ" 
		   	                     baseIcon="fa fa-edit"
		   	                     selectIcon="fa fa-edit"/>
			   </div>
			   <div className="icon-open-close">
			   		<ToogleButton name="PANEL_OPEN_BUTTON" baseIcon="fas fa-sign-in-alt" selectIcon="fas fa-sign-in-alt fa-flip-horizontal"/>
			   	</div>
			</div>
		)
	//}
}

/*const mapDispatchToProps = (dispatch, ownProps) => (
{
	  resetTreeModel:(evt)=>{
	  	 dispatch(resetTreeModel())
	  },
	  undoAction:(evt)=>{
	  	dispatch(undoActionToMainGraph());
	  },
	  redoAction:(evt)=>{
	  	dispatch(redoActionToMainGraph());
	  }
})

const mapStateToProps = (state, ownProps)  => {
  const {windowModeIsChanged} = state || {mainGraphIsChanged:{},windowModeIsChanged:{}}
  return {isEditMode:windowModeIsChanged[MODEL_RIGHT_WINDOW_OBJ]};
}

export default connect(mapStateToProps,mapDispatchToProps)(ModelMainHeaderComponent)*/
