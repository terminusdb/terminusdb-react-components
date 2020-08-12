import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';

import {Timeline} from './Timeline';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {DateRangePicker,isInclusivelyBeforeDay,SingleDatePicker} from "react-dates";
import moment from 'moment';
import { SizeMe } from 'react-sizeme' 

import {useCommitsControl} from '../hook/useCommitsControl';

export const TimelineCommits = ({woqlClient,setHead,branch,setError,currentStartTime,currentCommit,headMessage}) =>{
    const {dataProviderValues,gotoPosition,startTime,setStartTime,setSelectedValue,loadNextPage} = useCommitsControl(woqlClient, setError, branch, currentStartTime, currentCommit);
    const currentDay=moment()//startTime? moment.unix(startTime).format("DD MMM YYYY hh:mm a") : moment();
    const [selectedDay, onDateChange] = useState( currentDay);
    const [focused,onFocusChange] = useState(false);
    
    
    const startConf={ isTouchEnabled: true,
                      //isKeyboardEnabled: true,
                      isOpenEnding: true,
                      isOpenBeginning: true,
                      minEventPadding: 20,
                      maxEventPadding: 120,
                      linePadding: 100,
                      labelWidth: 200,
                      fillingMotion:{ stiffness:150, damping: 25},
                      slidingMotion:{ stiffness:150, damping: 25}}
    /*to be removed*/
    const styles={
                background: 'white', //'#f8f8f8',
                foreground: '#00C08B',//'#7b9d6f',
                outline: '#dfdfdf'
              }
    const setSelectedCommit=()=>{
       if(setHead){
          setHead(currentItem)
       }
    }
    
    const dataProvider= dataProviderValues.dataProvider;
    const currentItem = dataProvider.length>0  ? dataProvider[dataProviderValues.selectedValue] : {label:'No Value',author:'',message:''}
    const buttonActive = dataProvider.length>0 ? {onClick:setSelectedCommit} : {disabled:true}

    if(!currentItem) return null
    return (
      <div className="history__nav__content">
        <div className="history__nav__row"> 
            <SingleDatePicker
                showDefaultInputIcon
                date={selectedDay}
                onDateChange={(selectedDay)=>{
                      onDateChange(selectedDay)
                      setStartTime(selectedDay.add(1, 'day').unix())}}
                 focused={focused}
                 onFocusChange={({focused})=>{
                     onFocusChange(focused)
                 }}
                 numberOfMonths={1}
                 displayFormat='YYYY-MM-DD'
                 placeholder="yyyy-mm-dd"
                 isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                 />
              <div className="history__nav__display__commit">
                  <span className="history__nav__display__test">
                  {`${currentItem.label} - ${currentItem.author}` }</span> 
                  <span className="history__nav__display__test">{`${currentItem.message}` }</span>
              </div>

            <button className="tdb__button__base tdb__button__base--bgreen" {...buttonActive}>
               {headMessage}
            </button>    
        </div>       
          <div className="history__nav__slider__content" >
            <SizeMe>{({ size }) => 
              //{dataProvider.length===0 && <div>NO Value</div> }
              //{dataProvider.length>0 &&
                  <Timeline
                    containerWidth={size.width}
                    containerHeight={size.height || 100}
                    index={dataProviderValues.selectedValue}
                    indexClick={(index) => {
                       setSelectedValue(index)
                    }}
                    loadNextPage={loadNextPage}
                    {...startConf}
                    styles={styles}
                    values={dataProvider}
                    gotoPosition={gotoPosition}
                  />
                //}
              }
              </SizeMe>
          </div>   
      </div>
    );
  //}
}


//https://terminusdb.com/api/private/user

TimelineCommits.defaultProps = {
  branch:'main',
  currentStartTime:null
};