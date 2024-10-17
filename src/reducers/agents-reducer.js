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
          newWeatherLoaded: true,
          forecastCall: newForecast
        };

    case c.GET_WEATHER_LOADED:
        return {
          ...state,
          isLoaded: true,
          newWeatherLoaded: false,
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

    case c.GET_EVENTS_LOADED:
      return {
        ...state,
        isLoaded: true,
        dbEventsList: action.allEvents[0].events,
        id: action.allEvents[0].id
      }

    case c.GET_HOLIDAY_SUCCESS:
      const newHolidayList = action.holidayList.filter((e, i) => e.primary_type === "Federal Holiday");
      console.log(newHolidayList)

      const easter = action.holidayList.filter((e, i) => e.name === "Easter Monday");
      const mergedList = [ ...newHolidayList, ...easter ];

      const organizedList = mergedList.map( item => {
        const year = parseInt(item.date.iso.slice(0,4));
        const month = parseInt(item.date.iso.slice(5,7)) - 1;
        const day = parseInt(item.date.iso.slice(8,10));
        const date = new Date(year, month, day);

        const formatDate = (date) => date.toISOString().slice(0, 10);

        if (item.name === "Martin Luther King Jr. Day" || item.name === "Presidents' Day" || item.name === "Memorial Day" || item.name === "Labor Day") {
          const saturday = new Date(date);
          saturday.setDate(date.getDate() - 2);
          const sunday = new Date(date);
          sunday.setDate(date.getDate() - 1);

          return ({
            'name': item.name, 
            'date': [formatDate(saturday), formatDate(sunday), item.date.iso], 
            'month': item.date.iso.slice(5,7) === formatDate(saturday).slice(5,7) ? [item.date.iso.slice(5,7)] : [formatDate(saturday).slice(5,7), item.date.iso.slice(5,7)]}
          );
        } else if (item.name === "Thanksgiving Day") {
          const friday = new Date(date);
          friday.setDate(date.getDate() + 1);
          const saturday = new Date(date);
          saturday.setDate(date.getDate());
          const sunday = new Date(date);
          sunday.setDate(date.getDate());

          return ({
            'name': item.name, 
            'date': [item.date.iso, formatDate(friday), formatDate(saturday), formatDate(sunday)], 
            'month': item.date.iso.slice(5,7) === formatDate(sunday).slice(5,7) ? [item.date.iso.slice(5,7)] : [item.date.iso.slice(5,7), formatDate(sunday).slice(5,7)]}
          );

        } else if (item.name === "Christmas Day") {
          const xmasDay = new Date(new Date().getFullYear(), 11, 25).getDay();
          
          const holidayBreakArr = [ {day: 0, date: 17, numDays: 15}, {day: 1, date: 16, numDays: 16}, {day: 2, date: 15, numDays: 17}, {day: 3, date: 21, numDays: 15}, {day: 4, date: 20, numDays: 15}, {day: 5, date: 19, numDays: 15}, {day: 6, date: 18, numDays: 15} ];
          const thisYear = holidayBreakArr.filter(item => item.day === xmasDay);
          const startDay = new Date(new Date().getFullYear(), 11, thisYear[0].date);

          let breakDateArr = [];
          // let index = 0;
          for (let x = 0; x <= thisYear[0].numDays; x++) {
            const newDay = new Date(startDay);
            newDay.setDate(startDay.getDate() + x);
            breakDateArr = [...breakDateArr, newDay.toISOString().slice(0,10)];
            // index++;
          }

          return ({
            'name': item.name,
            'date': breakDateArr,
            'month': ['12', '1']
          })

        } else {
          return ({
            'name': item.name, 
            'date': [item.date.iso], 
            'month': [item.date.iso.slice(5,7)]}
          );
        }
      });

      const year = new Date().getFullYear();
      const additionalHolidays = [ {name: "Valentine's Day", date: [`${year}-02-14`], month: ['02']},
                                   {name: "St. Patrick's Day", date: [`${year}-03-17`], month: ['03']},
                                   {name: "Spring Break", date: ['2025-03-29', '2025-03-30', '2025-03-31', '2025-04-01', '2025-04-02', '2025-04-03', '2025-04-04', '2025-04-05', '2025-04-06'], month: ['03', '04']},
                                   {name: "Halloween", date: [`${year}-10-31`], month: ['10']}
                                  ];

      const finalHolidayList = [ ...organizedList, ...additionalHolidays ];

      // const organizedList = newHolidayList.reduce((acc, holiday) => { 
      //                       acc[holiday.date.iso] = holiday.name;
      //                       return acc;
      //                     }, []);

      // const reduceDuplicates = (arr, count) => {
      //   if (count >= arr.length-2) {
      //     return arr;
      //   } else if (arr[count] === arr[count + 2]) {
      //     return reduceDuplicates(arr.toSpliced(count+2, 2), count);
      //   } else {
      //     return reduceDuplicates(arr, count += 2);
      //   }
      // };

      // const uniqueList = reduceDuplicates(organizedList, 0);

      return {
          ...state,
          newHolidaysLoaded: true,
          holidayList: finalHolidayList
        };

    case c.GET_HOLIDAYS_LOADED:
      return {
        ...state,
        isLoaded: true,
        newHolidaysLoaded: false,
        holidayList: action.holidays[0].holiday,
        id: action.holidays[0].id
      }

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



