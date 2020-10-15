import React ,{useState} from 'react';
import {CLASS_PROPERTIES_LIST} from '../../constants/details-labels';
import {Dropdown} from '../../form/Dropdown'; 

export const PropertyMenuList =(props)=>  {

    const propertyTypeList=Array.from(CLASS_PROPERTIES_LIST);
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const addNewProperty=(propertyType,propertyRange)=>{
        toggle();
        props.addNewProperty(propertyType,propertyRange)
    }

    const entries = propertyTypeList.map((item, index) => 
                <button onClick={function(){addNewProperty(item.id,item.defaultRange)}}
                    className="tdb__dropdown__button" key={item.id} > {item.label}</button>)

	return(
		<div className="tdb__panel__bar">
            <Dropdown toggle={toggle} isOpen={dropdownOpen} title="Add Property" className="nav__main__link tdb__commit__bar--drop" >                   
             {entries}
            </Dropdown>
		</div>
	) 	
}

