import { useEffect, useState, useRef } from 'react';
import db from '../firebase.js';
import { collection, addDoc, onSnapshot } from 'firebase/firestore'; // doc, deleteDoc, updateDoc, 
// import useSTRController from "./useSTRController.js";
 
const usePropertyListing = () => {
  // const [propertyList] = useSTRController(); // propError
  // const [propertyList, setPropertyList] = useState();
  //const [listingsLoaded, setListingsLoaded] = useState(false);

  const [error, setError] = useState(null);
  const [listingAvailability, setListingAvailability] = useState(null);
  const [runCall, setRunCall] = useState(true);

  const propertyList = useRef();
  const listingsLoaded = useRef(false);
  const listingsArr = useRef();
  const percentArr = useRef(null);
  const propLength = useRef();

  const loadListings = async () => {
    console.log("usePropList, loadListings function")
    if (!listingsLoaded.current) {
      console.log('listings loaded', listingsLoaded);
      const unSubscribe = onSnapshot(
        collection(db, "listings"),
        (collectionSnapshot) => {
          const listings = [];
          collectionSnapshot.forEach((doc) => {
            listings.push({
              date: doc.data().date,
              availability: doc.data().datesPercent,
              month: parseInt(doc.data().month),
              year: doc.data().year,
              id: doc.id
            });
          });
          percentArr.current = listings;
          listingsLoaded.current = true;
          handleGetListingAvail();
        },
        (error) => {
          setError(error);
        }
      );
      return () => unSubscribe();
    }
  }

  const apiCall = async (singleId, index) => {
    // if(index < propLength.current) {
    //   console.log("apiCall function indexxxxx", index);
    //   setRunCall(true);
    //   handleScheduledCall(index+1);
    // }
    await fetch(`https://airbnb19.p.rapidapi.com/api/v1/checkAvailability?rapidapi-key=${process.env.REACT_APP_API_KEY}&propertyId=${singleId}`) 
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        } else {
          return response.json();
        }
      })
      .then((jsonifiedResponse) => {
        if(jsonifiedResponse.status === true) {
          console.log('singleId', singleId);
          parseData(jsonifiedResponse.data);
        } else {
          propLength.current = propLength.current - 1;
        }
        if(index < propertyList.current.length) {
          console.log("apiCall function indexxxxx", index);
          setRunCall(true);
          handleScheduledCall(index+1);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleGetListingAvail = () => {
    // conditional that checks if it's been a week since the last date program was run
    console.log('a', percentArr.current.length);
    if (percentArr.current.length === 0) {
      handleScheduledCall(0);
    } else {
      const dataDate = percentArr.current[0].date;
      const today =  new Date();
      const oldData = new Date(parseInt(dataDate.substring(0,4)), parseInt(dataDate.substring(5,7)), parseInt(dataDate.substring(8)));
      const daysPassed = (today.getTime() - oldData.getTime()) / (1000*60*60*24);
      if (daysPassed > 5) {
        console.log('running');
        handleScheduledCall(0);
      } else {
        setListingAvailability(percentArr.current);
      }
    }
  };

  function handleScheduledCall(index) {
    if (runCall === true) {
      setTimeout(() => {
        console.log("api call", index);
        setRunCall(false);
        apiCall(propertyList.current[index], index);
      }, 2000);
    }
  }

  const parseData = (newListings) => {
    const sixMonths = newListings.slice(0,6).reduce((array, month) => array.concat(month.days), []);
    const available = sixMonths.reduce((array, day) => array.concat(day.available), []);
    console.log('available', available);

    if (!listingsArr.current) {
      const availArr = available.map(item => [item]);
      listingsArr.current = availArr;
    } else {
      const availArr = listingsArr.current;
      const newAvailArr = availArr.map((item, index) => [...item, available[index]]);  
      listingsArr.current = newAvailArr;
    };
    console.log('availarr', listingsArr.current)
    console.log('availarr length', listingsArr.current[0].length)
    console.log('proplength length', propLength.current)

    if (listingsArr.current[0].length === propLength.current) {
      const finalArr = listingsArr.current.map(function(item) {
        return (
            item.reduce(function(tally, avail) {
            tally[avail] = (tally[avail] || 0) + 1;
             return tally; 
            }, {}))
      });
      console.log('finalArr', finalArr);
      const availability = finalArr.map(item => {
        if(item.false) {
          const percentCalc = (item.false/propLength.current).toFixed(2).substring(2);
          if (percentCalc === '00') {
            return '100';
          } else {
            return percentCalc;
          }
          // return (item.false/propLength.current).toFixed(2).substring(2);
        } else {
          return '0';
        }
      });
      console.log('availability', availability);
      const dates = sixMonths.reduce((array, day) => array.concat(day.date), []);
      console.log('dates', dates);
      const finalObj = dates.reduce((accumulator, value, i) => {
        return {...accumulator, [value]: availability[i]};
      }, {});
      console.log('finalObj', finalObj);

      const today = new Date().toISOString().substring(0,10);
      const allMonths = dates.map(x => x.substring(0,7));
      const uniqueMonths = [...new Set(allMonths)];
      
      const filterMonth = uniqueMonths.map(item => {
        return {
          'date': today,
          'month': item.substring(5), 
          'year': item.substring(0,4),
          'datesPercent': Object.keys(finalObj).filter((key) => key.substring(0,7) === item).reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: finalObj[key]
            });
        }, {})} 
      });
      filterMonth.forEach(x => handleSendingAvail(x));
      console.log('filterMonth', filterMonth);
      listingsLoaded.current = false;
    }
    loadListings();
  }
  
  const handleSendingAvail = async (percents) => {
    await addDoc(collection(db, "listings"), percents);
  };

  const handlePropList = (properties) => {
    if (properties) {
      // propLength.current = properties.length;
      console.log('properties', properties);
      propertyList.current = properties;
      console.log("propertyList.current.length", propertyList.current.length);
      propLength.current = properties.length;
      console.log('propLength.current', propLength.current);
      //console.log(typeof(propLength.length));
      loadListings();
    }  // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // console.log('list Avail', listingAvailability);
  // console.log('properties', properties);

  return [listingAvailability, handlePropList, error];
}

export default usePropertyListing;
