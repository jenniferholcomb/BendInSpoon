import React, { useEffect, useReducer } from 'react';
import agentsReducer from '../reducers/agents-reducer';
import { getFetchFailure, getWeatherLoaded, getWeatherSuccess } from '../actions';
import styles from "./Weather.module.scss";
import WeatherDay from './WeatherDay';

import db from './../firebase.js';
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

const {compWeaWrapper, weatherWrapper, weaItem} = styles;

const initialState = {
  isLoaded: false,
  newWeatherLoaded: false,
  forecastCall: [],
  forecast: [],
  id: null,

  // lines below for static weather data, API also needs to be commented out
  // isLoaded: true,
  // forecast: [51, 48, 50, 49, 52, 62, 64, 87, 82, 83, 81, 84, 90, 95, 'c02d', 'c01d', 'c02d', 'c02d', 'c02d', 'c02d', 'c02d', 'Few clouds', 'Clear Sky', 'Few clouds', 'Few clouds', 'Few clouds', 'Few clouds', 'Few clouds'],
  error: null
};

function Weather () {

  const [state, dispatch] = useReducer(agentsReducer, initialState)

  const loadWeather = async () => {
    const unSubscribe = onSnapshot(
      collection(db, "weather"),
      (collectionSnapshot) => {
        const weatherForecast = [];
        collectionSnapshot.forEach((doc) => {
          weatherForecast.push({
            forecast: doc.data().forecast,
            date: doc.data().date,
            id: doc.id
          });
        });
        handleWeatherData(weatherForecast);
      },
      (error) => {
        dispatch(error);
      }
    );  
    return () => unSubscribe();
  }

  const handleWeatherData = (weatherForecast) => {
    const action = getWeatherLoaded(weatherForecast);
    dispatch(action);

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    if (weatherForecast[0].date !== today) {
      makeAPICall();
      console.log('why here')
    } 
  }

  const makeAPICall = async () => {
    console.log('making weather call')
    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=Bend,OR&key=${process.env.REACT_APP_API_KEY_WEATHER}&units=I&days=7`)
    .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        } else {
          return response.json()
        }
      })
      .then((jsonifiedResponse) => {
        console.log(jsonifiedResponse)
        const action = getWeatherSuccess(jsonifiedResponse.data)
        dispatch(action)
      })
      .catch((error) => {
        const action = getFetchFailure(error.message)
        dispatch(action)
      });
  }
  
  useEffect(() => {
    loadWeather();
  }, [])

  

  const { error, isLoaded, newWeatherLoaded, forecastCall, forecast, id } = state;

  const handleAddingWeather = async () => {
    const addForecast = { 
      forecast: forecastCall, 
      date: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
    };
    await addDoc(collection(db, "weather"), addForecast);
    await loadWeather();
  }

  const deleteWeatherData = async (id) => {
    await deleteDoc(doc(db, "weather", id));
  }

  useEffect(() => {
    if(newWeatherLoaded) {
      handleAddingWeather();
      deleteWeatherData(id);
    }
  }, [newWeatherLoaded])

  console.log(forecast)

  if (error) {
    return ( 
      <div className={weatherWrapper}>
        <h1>Error: {error}</h1>
      </div> 
    );
  } else if (!isLoaded) {
    return (
      <div className={weatherWrapper}>
        <h1>...Loading...</h1>
      </div>
    );
  } else {
    return (
      // <div className={compWeaWrapper}>
        <div className={weatherWrapper}>
          <WeatherDay newForecast={forecast}/>
        </div>
      // </div>
    );
  }
}

export default Weather;




