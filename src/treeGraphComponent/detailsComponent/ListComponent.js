import React from 'react';

export const ListComponent = (props) =>  {

	const removeItem=(evt)=>{
		props.removeItem(evt.target.name);
	}

	const dataProvider= props.dataProvider || [];

	return(<div className="tdb__panel__box">
		{dataProvider.map((elementItem,index)=>{
		  	return(<div key={'__elementItem__'+index}>		  			
		  			  <div className="tdb__panel__row">
		  			  		<label className="tdb__panel__label">{elementItem.label}</label>
		  			  		<button className="tdb__button__base tdb__panel__button tdb__panel__button--red fa fa-minus"  name={elementItem.name} onClick={removeItem}></button>
		  			  </div>			  		
		  		  </div>)
		})}
		</div>
	)	
}