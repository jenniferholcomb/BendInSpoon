import React, { useEffect, useReducer } from 'react';
import agentsReducer from '../reducers/agents-reducer';
import { getFetchFailure, getHolidaySuccess, getHolidaysLoaded } from '../actions';
import styled from 'styled-components';

import db from './../firebase.js';
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

const HolidayWrapper = styled.section`
  border-bottom: 1px solid black;
  border-right: 1px solid black;

`;

const initialState = {
  isLoaded: false,
  newHolidaysLoaded: false,
  holidayCall: [],
  holidayList: [],
  error: null,
  id: null
};

function Holiday () {

  const [state, dispatch] = useReducer(agentsReducer, initialState)
  
  const loadHolidays = async () => {
    const unSubscribe = onSnapshot(
      collection(db, "holidays"),
      (collectionSnapshot) => {
        const holidays = [];
        collectionSnapshot.forEach((doc) => {
          holidays.push({
            holiday: doc.data().holiday,
            addDate: doc.data().addDate,
            id: doc.id
          });
        });
        handleHolidayData(holidays);
      },
      (error) => {
        dispatch(error);
      }
    );  
    return () => unSubscribe();
  }

  const handleHolidayData = (holidays) => {
    const action = getHolidaysLoaded(holidays);
    dispatch(action);

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const listYear = holidays[0].addDate.slice(0,4);

    if (month === 0 && year !== listYear) {
      console.log("calling for holidays")
      makeAPICall();
    } 
  }

  const makeAPICall = () => {
    const year = new Date().getFullYear();
    fetch(`https://calendarific.com/api/v2/holidays?&api_key=${process.env.REACT_APP_API_KEY_HOLIDAY}&country=US&year=${year}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        } else {
          return response.json()
        }
      })
      .then((jsonifiedResponse) => {
        const action = getHolidaySuccess(jsonifiedResponse.response.holidays)
        dispatch(action)
      })
      .catch((error) => {
        const action = getFetchFailure(error.message)
        dispatch(action)
      });
  }

  const { error, newHolidaysLoaded, isLoaded, holidayList, id } = state;
  console.log(holidayList)

  const handleAddingHolidays = async () => {
    const addHolidays = { 
      holiday: holidayList, 
      addDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
    };
    await addDoc(collection(db, "holidays"), addHolidays);
    await loadHolidays();
  }

  const deleteHolidayData = async (id) => {
    await deleteDoc(doc(db, "holidays", id));
  }

  useEffect(() => {
    loadHolidays();
  }, [])

  useEffect(() => {
    if(newHolidaysLoaded) {
      handleAddingHolidays();
      deleteHolidayData(id);
    }
  }, [newHolidaysLoaded])

  if (error) {
    return ( 
      <HolidayWrapper>
        <h1>Error: {error}</h1>
      </HolidayWrapper> 
    );
  } else if (!isLoaded) {
    return (
      <HolidayWrapper>
        <h1>...Loading...</h1>
      </HolidayWrapper>
    );
  } else {
    return (

      <HolidayWrapper>
        {holidayList.map(item => 
          <p>{item.name}</p>
        )}
      </HolidayWrapper>
    );
  }
}

export default Holiday;