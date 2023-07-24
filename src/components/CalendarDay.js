import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';

function CalendarDay ({ month, availablePercent, monthName }) {
  const [monthBg, setMonthBg] = useState();

  useEffect(() => {
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
  }, []);


  return (
    <>
      {monthBg && (
        <>
          <div className="cal-month">
            <div className="cal-text">
              <p>{monthName}</p>
            </div>
          </div>
          {/* <div className="list-item"> */}
            {monthBg.map((item, index) => 
              <>
                <div className={`list-item-cal-${index + 1}`} key={index} style={{backgroundColor: `${item.background}`}}>
                  <>
                    <p className="date">{item.date.charAt(8) === '0' ? item.date.substring(9) : item.date.substring(8)}</p>
                    <p className="prop-percent">{availablePercent[0].availability[item.date]}</p> 
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