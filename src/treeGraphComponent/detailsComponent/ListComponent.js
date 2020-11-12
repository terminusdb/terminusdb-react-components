import React from 'react';

export const ListComponent = (props) =>  {

	const removeItem=(evt)=>{
		props.removeItem(evt.target.name);
	}

	const dataProvider= props.dataProvider || [];

	return(<>
		{dataProvider.map((elementItem,index)=>{
			
		  	return(<div key={'__elementItem__'+index}>		  			
		  			  <div className="tdb__list__item">
		  			  		<label className="tdb__list__label">{elementItem.label}</label>
		  			  		{props.removeItem && <button className="tdb__button__base tdb__panel__button tdb__panel__button--green fa fa-minus"  name={elementItem.name} onClick={removeItem}></button>}
		  			  </div>			  		
		  		  </div>)
		})}
		</>
	)	
}