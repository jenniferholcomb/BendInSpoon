import React, { useState, useEffect } from "react";
import CalendarDay from "./CalendarDay";
import useSTRController from "./useSTRController.js";
import usePropertyListing from "./usePropertyListing";

//import styled from 'styled-components';
import styles from "./Calendar.module.scss";
import { connectFirestoreEmulator } from "firebase/firestore";
// import Events from "./Events";

const { nameWrapper, calContainer, compWrapper } = styles;

// const CompWrapper = styled.section`
//   outline: px solid white;
//   border-radius: none;
//   display: grid;
//   grid-row: 1;
//   grid-template-columns: repeat(7, 1fr);
//   grid-template-rows: 1.2em repeat(5, 1fr);
//   grid-gap: 0px;
//   height: 300px;
//   background-color: rgb(247, 243, 236);
//   box-shadow: 0 0px 10px 0 rgba(247, 243, 243, 0.459), -15px 20px 25px 0 rgba(77, 76, 76, 0.25);
// `;

// const NameWrapper = styled.section` 
//   display: grid;
//   justify-items: center;
//   font-size: 20px;
//   font-weight: bold;
//   margin-top: 17px;
//   margin-bottom: -12px;
// `;

// const testerWrap = styled.section`

// `;

const Calendar = () => {
  const [dates, setDates] = useState([]); 
  const [month, setMonth] = useState();
  // eslint-disable-next-line
  const [propertyList, loadProperties] = useSTRController();
  const [listingAvailability] = usePropertyListing(propertyList);
  const [percentLoaded, setPercentLoaded] = useState(false);
  const [monthAvail, setMonthAvail] = useState();
  const [monthName, setMonthName] = useState();

  useEffect(() => {
    loadProperties(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const today = new Date();
    const monthNow = today.getMonth();
    setMonth(monthNow + 1);
    const monthName = today.toLocaleString('default', { month: 'long' }).toUpperCase();
    setMonthName(monthName);
    const year = today.getFullYear();
    const monthDays = [31, (( year % 4 ) === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    const oneIndex = new Date(today.getFullYear(), monthNow, 1).getDay();
    
    const preMonthArr = Array.from(Array(oneIndex)).map((x, i) =>  { 
      return { 'date': new Date(
        monthNow === 0 ? year - 1 : year, 
        monthNow === 0 ? 11 : monthNow - 1, 
        monthDays[monthNow - 1] - i
        ).toISOString().substring(0,10) }
    }).reverse();
    const preMonthArrBg = preMonthArr.map((item) => ({
      ...item,
      background: 'rgba(100, 99, 99, 0.309)'
    }));
    const thisMonthArr = Array.from(Array(monthDays[monthNow])).map((x, i) =>  { 
      return { 'date': new Date(
        year, 
        monthNow, 
        i + 1
        ).toISOString().substring(0,10) }
    });

    const lastIndex = new Date(today.getFullYear(), monthNow, monthDays[monthNow]).getDay();

    const endMonthArr = Array.from(Array(6 - lastIndex)).map((x, i) =>  { 
      return { 'date': new Date(
        monthNow === 11 ? year + 1 : year, 
        monthNow === 11 ? 0 : monthNow + 1, 
        i + 1
        ).toISOString().substring(0,10) }
    });
    const endMonthArrBg = endMonthArr.map((item) => ({
      ...item,
      background: 'rgba(100, 99, 99, 0.309)'
    }));

    const allMonth = [...preMonthArrBg, ...thisMonthArr, ...endMonthArrBg];
    setDates(allMonth);
  }, []);

  useEffect(() => {
    if (propertyList && listingAvailability) {
      const availMonth = listingAvailability.filter(item => item.month === month);
      setMonthAvail(availMonth);
      setPercentLoaded(true);
    } else if (propertyList) {
    }
  }, [propertyList, listingAvailability]);

  return (
    <>
      <div className={calContainer}>
        <div className={nameWrapper}>
          STR PERCENTAGE 
        </div>
        <div className="cal-cap">
          % SHORT TERM RENTAL'S BOOKED
        </div>
        <div className={compWrapper}>
          {percentLoaded ?
          <CalendarDay month={dates} 
                       availablePercent={monthAvail} 
                       monthName={monthName} />
          :
          null
          }
        </div>
      </div>
    </>
  );
}

export default Calendar;
