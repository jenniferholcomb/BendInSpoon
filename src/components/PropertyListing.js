import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ListingDay from './ListingDay';
import db from './../firebase.js';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const ListingWrapper = styled.section`
  grid-row: 2;
  margin-top: 20px;
`;

const NameWrapper = styled.section` 
  display: grid;
  justify-items: end;
  font-size: 23px;
  font-weight: bold;
  font-style: italic;
`;

const ElementWrapper = styled.section`
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 14% 43% 43%;
  grid-gap: 0px;
  height: 150px;
  background-color: rgb(247, 243, 236);
`;
 
function PropertyListing (props) {
  const fornightList = Array.from({length: 17}, () => ([]));

  const [error, setError] = useState(null);
  //const getListings = useRef(true);
  const [listingLoaded, setListingLoaded] = useState(false);
  const [fortnightAvail, setFortnightAvail] = useState(null);
  const listingsArr = useRef(fornightList);
  const percentArr = useRef(null);

  const { days, properties } = props;
  //const properties = propertiesAll.slice(0,5);
  const propLength = useRef(properties.length);

  useEffect(() => {
    const unSubscribe = onSnapshot(
      collection(db, "listings"),
      (collectionSnapshot) => {
        const listings = [];
        collectionSnapshot.forEach((doc) => {
          listings.push({
            availability: doc.data().availability,
            id: doc.id
          });
        });
        setFortnightAvail(listings);
        percentArr.current = listings;
        // eslint-disable-next-line
        handleGetListingAvail();
      },
      (error) => {
        setError(error);
      }
    );
    return () => unSubscribe();
  }, []);

  const apiCall = async (singleId) => {
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
          parseData(jsonifiedResponse.data[0].days);
        } else {
          propLength.current = propLength.current - 1;
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleGetListingAvail = () => {
    if (percentArr.current.length === 0) {
      properties.forEach((id, index) => {
        setTimeout(() => {
          apiCall(id);
        }, index * 750)
      })
    } else {
      setListingLoaded(true);
    }
  };

  const parseData = (newListings) => {
    const today = new Date().toISOString().substring(0,10);
    const index = newListings.map(e => e.date).indexOf(today);
    const fortnight = newListings.splice(index, 17);
    const available = fortnight.reduce((array, day) => array.concat(day.available), []);

    const availArr = listingsArr.current;
    available.forEach((item, index) => availArr[index].push(item));
    listingsArr.current = availArr;
    console.log(availArr)
    console.log('availarr length', availArr[0].length)
    console.log('proplength length', propLength.current)

    if (availArr[0].length === propLength.current) {
      const finalArr = availArr.map(function(item) {
        return (
            item.reduce(function(tally, avail) {
            tally[avail] = (tally[avail] || 0) + 1;
             return tally; 
            }, {}))
      });
      const availability = finalArr.map(item => {
        if(item.false) {
          return (item.false/properties.length).toFixed(2).substring(2);
        } else {
          return '0';
        }
      });
      console.log(availability);
      handleSendingAvail({availability});
    }
  }
  
  const handleSendingAvail = async (percents) => {
    await addDoc(collection(db, "listings"), percents);
    setFortnightAvail({percents});
    setListingLoaded(true);
  };

  console.log(fortnightAvail);

  if (error) {
    return ( 
      <ListingWrapper>
        <h1>Error: {error}</h1>
      </ListingWrapper> 
    );
  } else if (listingLoaded) {
    return (
      <ListingWrapper>
         <NameWrapper>
          STR OCCUPANCY %
        </NameWrapper>
        <ElementWrapper>
          <ListingDay days={props.days} />
        </ElementWrapper>
      </ListingWrapper>
    );
  } else {
    return (
      <ListingWrapper>
        <h1>...Loading...</h1>
      </ListingWrapper>
    );
  }
}

PropertyListing.propTypes = {
  propIds: PropTypes.array,
  days: PropTypes.array,
};

export default PropertyListing;
