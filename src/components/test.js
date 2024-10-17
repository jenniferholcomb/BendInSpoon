import React, { useEffect, useReducer } from 'react';
import agentsReducer from '../reducers/agents-reducer';
import { getFetchFailure, getEventsSuccess, getEventsLoaded } from '../actions';
import EventsItem from './EventsItem';

import db from './../firebase.js';
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

const initialState = {
  isLoaded: false,
  eventsList: [
    {'addDate': '2024-10-17'},
    {'events': [
      {'name': 'Bend Fall Festival', 'date': ['2024-11-2', '2024-11-3'], 'description': 'A festival celebrating the season with live music, art, food, and family-friendly activities.', 'month': ['11']},
      {'name': 'Holiday Lights Paddle Parade', 'date': ['2024-12-15'], 'description': 'A unique event where kayakers and paddleboarders decorate their vessels and float down the Deschutes River.', 'month': ['12']},
      {'name': 'Downtown Bend Artisans Market', 'date': ['2024-10-19'], 'description': 'An open-air market with local artisans selling handcrafted goods in the heart of Bend.', 'month': ['10']},
      {'name': 'Mt Bachelor Opening Day', 'date': ['2024-11-29'], 'description': 'The winter season kicks off with the anticipated opening of Mt. Bachelor for skiing and snowboarding', 'month': ['11']},
      {'name': 'Hippie Death Cult', 'date': ['2024-11-9'], 'description': 'Psychedelic doom rock band performing at the Volcanic Theatre Pub.', 'month': ['11']},
      {'name': 'Hot Buttered Rum', 'date': ['2024-11-10'], 'description': 'A bluegrass and Americana band performing at the Midtown Ballroom.', 'month': ['11']},
      {'name': 'Curtis Salgado', 'date': ['2024-11-15'], 'description': 'A  blues performance at the Midtown Ballroom.', 'month': ['11']},
      {'name': 'Terrapin Flyer', 'date': ['2024-11-17'], 'description': 'A popular Grateful Dead tribute band performing at the Volcanic Theatre Pub', 'month': ['11']},
      // {'name': 'Bend Fall Festival', 'date': ['2024-11-2', '2024-11-3'], 'description': '', 'month': ['11']},
      // {'name': 'Bend Fall Festival', 'date': ['2024-11-2', '2024-11-3'], 'description': '', 'month': ['11']},
    ]}
  ],
  error: null
};

function Events (props) {

  const [state, dispatch] = useReducer(agentsReducer, initialState)

  const { error, isLoaded, eventsList, dbEventsList, id } = state;

  console.log(eventsList);

  const loadEvents = async () => {
    const unSubscribe = onSnapshot(
      collection(db, "events"),
      (collectionSnapshot) => {
        const allEvents = [];
        collectionSnapshot.forEach((doc) => {
          allEvents.push({
            events: doc.data().events,
            addDate: doc.data().addDate,
            id: doc.id
          });
        });
        const action = getEventsLoaded(allEvents);
        dispatch(action);
      },
      (error) => {
        dispatch(error);
      }
    );  
    return () => unSubscribe();
  }

  const handleComparingEventLists = () => {
    const initialEvents = eventsList.filter(item => item.events);
    const updatedEvents = dbEventsList.filter(item => item.events);

    // Find added events in updatedList
    const addedEvents = updatedEvents.filter(event => 
      !initialEvents.some(initialEvent => initialEvent.name === event.name)
    );
  
    // Find removed events in updatedList
    const removedEvents = initialEvents.filter(event => 
      !updatedEvents.some(updatedEvent => updatedEvent.name === event.name)
    );

    // console.log(addedEvents)
    // console.log(removedEvents)

    if (addedEvents.length !== 0 || removedEvents.length !== 0) {
      console.log("adding new events")
      handleUpdatingEvents();
      deleteEventsData();
    }
  }

  const handleUpdatingEvents = async () => {
    const updateEvents = { 
      events: eventsList, 
      addDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
    };
    await addDoc(collection(db, "events"), updateEvents);
    await loadEvents();
  }

  const deleteEventsData = async () => {
    await deleteDoc(doc(db, "events", id));
  }
  
  useEffect(() => {
    if(dbEventsList) {
      handleComparingEventLists();
    }
  }, [dbEventsList])

  useEffect(() => {
    loadEvents();
  }, [])
  
  // get data from serverless function
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/getEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setEvents(data.events); // Assuming `events` is part of the response
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    }

    setLoading(false);
  };

  if (error) {
    return ( 
      <>
        <h1>Error: {error}</h1>
      </> 
    );
  } else if (!isLoaded) {
    return (
      <>
        <h1>...Loading...</h1>
      </>
    );
  } else {
    return (

      <>
        <table>
          <tr>
            <th>DATE</th>
            <th>EVENT</th>
          </tr>
          <tr><td>May 19</td><td>Matchbox Twenty</td></tr>
          <tr><td>May 28</td><td>James Taylor</td></tr>
          <tr>
            <th>DATE</th>
            <th>HOLIDAY</th>
          </tr>
          <tr><td>May 22</td><td>Memorial Day</td></tr>
        </table>
      </>
    );
  }
}

export default Events;


const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError(null);

  try {
    const response = await fetch('/.netlify/functions/getEvents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    if (response.ok) {
      setEvents(data.events);
      setWeather(data.weather);
    } else {
      setError(data.error);
    }
  } catch (err) {
    setError('An error occurred while fetching data.');
  }

  setLoading(false);
};


  useEffect(() => {
    fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_API_KEY_TICKET}&postalCode=97701&radius=20&locale=*&endDateTime=2023-05-21T15:01:00Z`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        } else {
          return response.json()
        }
      })
      .then((jsonifiedResponse) => {
        console.log(jsonifiedResponse);
        const action = getEventsSuccess(jsonifiedResponse._embedded.events)
        dispatch(action)
      })
      .catch((error) => {
        const action = getFetchFailure(error.message)
        dispatch(action)
      });
  }, [])



  const fetchEvents = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions",
        {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.__}`
          },
          body: {
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'user',
                  content: `Give me the 10 most popular events happening in Bend, OR in key-value format where the key is the event name and the value is a short description.`,
                },
              ]
          }
        }
      );
      
      // const eventsFromOpenAI = response.data.choices[0].message.content;
      // const result = {
      //   events: eventsFromOpenAI,
      // };

      // const body = JSON.stringify(result);

      console.log(response)

      // return {
      //   statusCode: 200,
      //   body: JSON.stringify(result),
      // };
    } catch (error) {
      console.error('Error fetching events:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch event data.' }),
      };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);