import React, {useState, useEffect} from "react";
import styles from "./Calendar.module.scss";
import PropTypes from 'prop-types';

const {calMonth, calText, date, propPercent, listItemCal} = styles;

function CalendarDay ({ month, availablePercent, monthName }) {
  const [monthBg, setMonthBg] = useState();
  console.log('availPerc', availablePercent);

  useEffect(() => {
    console.log('begin')
    const newMonth = month.map(item => {
      if (availablePercent[0].availability[item.date] >= 90) { 
        return {
          ...item,
          background: 'rgb(254, 232, 218)'
        } 
      } else if (availablePercent[0].availability[item.date] >= 70) {
        return {
          ...item,
          background: 'rgba(243, 249, 194, 0.8)'
        }
      } else {
        if (item.background) {
          return { ...item };
        } else {
          return {
            ...item,
            background: 'rgba(211, 238, 206, 0.9)'
          };
        }
      }
    });

    setMonthBg(newMonth);
    console.log('monthbg', monthBg);
  }, []);


  return (
    <>
      {monthBg && (
        <>
          <div className={calMonth}>
            <div className={calText}>
              <p>{monthName}</p>
            </div>
          </div>
          {/* <div className="list-item"> */}
            {monthBg.map((item, index) => 
              <>
                <div className={listItemCal} key={index} style={{backgroundColor: `${item.background}`}}>
                  <>
                    <p className={date}>{item.date.charAt(8) === '0' ? item.date.substring(9) : item.date.substring(8)}</p>
                    <p className={propPercent}>{availablePercent[0].availability[item.date]}</p> 
                  </>
                </div>
              </>
            )}
          {/* </div> */}
        </>
      )}
    </>
  );
}

CalendarDay.propTypes = {
  month: PropTypes.array
};

export default CalendarDay;