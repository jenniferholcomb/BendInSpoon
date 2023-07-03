import React, { useEffect, useState } from 'react';
import db from '../firebase.js';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const useSTRController = () => {
  const [propertyList, setPropertyList] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const unSubscribe = onSnapshot(
      collection(db, "properties"),
      (collectionSnapshot) => {
        const properties = [];
        collectionSnapshot.forEach((doc) => {
          properties.push({
            propertyId: doc.data().propertiesId,
            date: doc.data().date,
            id: doc.id
          });
        });
        // eslint-disable-nxt-line
        handleGetProperties(properties);
      },
      (error) => {
        setError(error);
      }
    );
    return () => unSubscribe();
  }, []);

  const handleGetProperties = async (propertiesAll) => {
    if (propertiesAll.length === 0) {
      await fetch(`https://airdna1.p.rapidapi.com/properties?rapidapi-key=${process.env.REACT_APP_API_KEY}&location=bend`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        } else {
          return response.json()
        }
      })
      .then((jsonifiedResponse) => {
        handlePropertiesSuccess(jsonifiedResponse.properties); 
      })
      .catch((error) => {
        setError(error)
      });
    } else {
      setPropertyList(propertiesAll[0].propertyId);
    }
  }

  const handlePropertiesSuccess = (freshProperties) => {
    const handleFilteringProperties = freshProperties.filter(listing => listing.platforms.airbnb_property_id !== null 
      && listing.room_type === "Entire home/apt"
      && listing.latitude < 44.10125
      && listing.latitude > 44.03699
      && listing.longitude > -121.36035
      && listing.longitude < -121.27744);
    
    const propertiesId = handleFilteringProperties.reduce((array, listing) => array.concat(listing.airbnb_property_id), []);
    const date = new Date().toISOString().substring(0,10);
    const propObj = {date, propertiesId};
    
    setPropertyList(propertiesId);
    handleSendingProps(propObj);
  };

  const handleSendingProps = async (propertiesId) => {
    await addDoc(collection(db, "properties"), propertiesId);
  };

  return [ propertyList, error ];
}

export default useSTRController;
