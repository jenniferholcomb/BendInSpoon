import React from "react";
import styles from "./Weather.module.scss";
import PropTypes from 'prop-types';

const {weaItem, logo} = styles;

function WeatherDay(props) {

  const { newForecast } = props;

  console.log('weather', newForecast);
  return (
    <React.Fragment>
      {newForecast.slice(0, 21).map((item, index) => 
        (index < 14) ? <div className={weaItem} key={index}>{item}°</div>
        : 
        <div className={weaItem} key={index}><img className={logo} src={require(`./../img/icons/${item}.png`)} alt={props.newForecast[index + 7]} /></div>       
      )}
    </React.Fragment>
  );
}

WeatherDay.propTypes = {
  newForecast: PropTypes.array
};

export default WeatherDay;
