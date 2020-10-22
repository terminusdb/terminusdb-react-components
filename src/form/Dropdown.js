import React , {useState} from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import PropTypes from "prop-types";

export const Dropdown = ({className, children, title, isOpen, toggle, mouseOverActive, onClickAction }) => {

    const onOutsideClick = ()=>{
        if(isOpen===true){
            toggle(false)
        }
    }
    const onMouseEnter=()=>{
        toggle(true);
    }

    const onMouseLeave =()=>{
        toggle(false)
    }

    const onClick=()=>{
        toggle(!isOpen)
        if(onClickAction)onClickAction()
    }

    const mouseOver = mouseOverActive===true ? {onMouseEnter:onMouseEnter, onMouseLeave:onMouseLeave} : {}
    const dropdownContent = isOpen===true ? "tdb__dropdown__content  tdb__dropdown__content--show" : "tdb__dropdown__content tdb__dropdown__content--hide"

    return(<OutsideClickHandler onOutsideClick={onOutsideClick} >  
                <div className="tdb__dropdown" {...mouseOver} >
                    <button className={`tdb__dropdown__button tdb__dropdown__button--top ${className}`}  >
                        <span onClick={onClick} className="tdb__dropdown__title">{title}</span><i className="fa fa-caret-down"></i>
                    </button>
                    
                    <div className={dropdownContent}>
                      {children}
                    </div>                  
                </div>
            </OutsideClickHandler>
            
    )

}

Dropdown.propTypes = {
        className:PropTypes.string,
        title:PropTypes.string,
        isOpen:PropTypes.bool.isRequired,
        toggle:PropTypes.func.isRequired
    }

Dropdown.defaultProps = {
    className: '',
    title:"Select"
};
