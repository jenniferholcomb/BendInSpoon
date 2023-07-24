import React, { useEffect, useReducer } from 'react';
import agentsReducer from '../reducers/agents-reducer';
import { getFetchFailure, getWeatherSuccess } from '../actions';
import styles from "./Weather.module.scss";
import styled from 'styled-components';
import WeatherDay from './WeatherDay';

const {compWeaWrapper, weatherWrapper, weaItem} = styles;

const initialState = {
  // isLoaded: false,
  // forecast: [],

  isLoaded: true,
  forecast: [51, 48, 50, 49, 52, 62, 64, 87, 82, 83, 81, 84, 90, 95, 'c02d', 'c01d', 'c02d', 'c02d', 'c02d', 'c02d', 'c02d', 'Few clouds', 'Clear Sky', 'Few clouds', 'Few clouds', 'Few clouds', 'Few clouds', 'Few clouds'],
  error: null
};

function Weather () {

  const [state, dispatch] = useReducer(agentsReducer, initialState)
  
  // useEffect(() => {
  //   fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=Bend,OR&key=${process.env.REACT_APP_API_KEY_WEATHER}&units=I&days=7`)
  //   .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`${response.status}: ${response.statusText}`);
  //       } else {
  //         return response.json()
  //       }
  //     })
  //     .then((jsonifiedResponse) => {
  //       console.log(jsonifiedResponse)
  //       const action = getWeatherSuccess(jsonifiedResponse.data)
  //       dispatch(action)
  //     })
  //     .catch((error) => {
  //       const action = getFetchFailure(error.message)
  //       dispatch(action)
  //     });
  // }, [])

  const { error, isLoaded, forecast } = state;

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




