import React, { useState, useEffect } from "react";
import CalendarDay from "./CalendarDay";
import useSTRController from "./useSTRController.js";
import usePropertyListing from "./usePropertyListing";
import styles from "./Calendar.module.scss";
// import { connectFirestoreEmulator } from "firebase/firestore";
// import Events from "./Events";

const {nameWrapper, calContainer, compWrapper, calCap} = styles;

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
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyList, listingAvailability]);

  return (
    <>
      <div className={calContainer}>
        <div className={nameWrapper}>
          STR PERCENTAGE 
        </div>
        <div className={calCap}>
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
