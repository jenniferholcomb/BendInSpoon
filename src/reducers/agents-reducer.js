import * as c from '../actions/ActionTypes';

const agentsReducer = (state, action) => {

  switch (action.type) {
  
    case c.GET_WEATHER_SUCCESS:
      const lows = action.forecast.reduce((array, list) => array.concat(Math.round(list.low_temp)), []);
      const highs = action.forecast.reduce((array, list) => array.concat(Math.round(list.high_temp)), []);
      const icons = action.forecast.reduce((array, list) => array.concat(list.weather.icon), []);
      const descript = action.forecast.reduce((array, list) => array.concat(list.weather.description), []);
      const newForecast = [...lows, ...highs, ...icons, ...descript];
                                                                    
      return {
          ...state,
          isLoaded: true,
          forecastCall: newForecast
        };

    case c.GET_WEATHER_LOADED:
        return {
          ...state,
          isLoaded: true,
          forecast: action.weatherForecast[0].forecast,
          id: action.weatherForecast[0].id
        }

    case c.GET_EVENTS_SUCCESS:
      const newEventsList = action.eventsList.reduce((array, list) => 
                                          array.concat(list.name)
                                          .concat(list.dates.start.localDate), 
      []);
      return {
          ...state,
          isLoaded: true,
          eventsList: newEventsList
        };

    case c.GET_HOLIDAY_SUCCESS:
      const newHolidayList = action.holidayList.filter((e, i) => e.primary_type === "State Holiday") 
                                                                 // e.primary_type === "Christian" )
                                               .reduce((array, list) => array.concat(list.name).concat(list.date.iso), 
      []);

      const reduceDuplicates = (arr, count) => {
        if (count >= arr.length-2) {
          return arr;
        } else if (arr[count] === arr[count + 2]) {
          return reduceDuplicates(arr.toSpliced(count+2, 2), count);
        } else {
          return reduceDuplicates(arr, count += 2);
        }
      };

      const uniqueList = reduceDuplicates(newHolidayList, 0);

      // const today = new Date().getDate();
      // const month = today.getMonth();
      // if ((today + 14) >= 30) {

      // } else {

      // }
      // const twoWeekList = uniqueList.filter(e => e.)

      return {
          ...state,
          isLoaded: true,
          holidayList: uniqueList
        };

    case c.GET_FETCH_FAILURE:
      return {
        ...state,
        isLoaded: true,
        error: action.error
      };
    default:
      throw new Error(`There is no action matching ${action.type}.`);
    
    case c.GET_DATA_FAILURE:
      return {
        ...state,
        error: action.error
      }
  }
}

export default agentsReducer;



