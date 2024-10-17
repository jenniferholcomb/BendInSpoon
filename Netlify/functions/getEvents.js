const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Store API key in Netlify environment variable
const OTHER_API_KEY = process.env.OTHER_API_KEY;   // Another API key for a different service

exports.handler = async (event, context) => {
  const location = 'Bend, OR';
  const numEvents = 10; // Always requesting 10 popular events

  try {
    // OpenAI API call
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Give me the ${numEvents} most popular events happening in ${location} in key-value format where the key is the event name and the value is a short description.`,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const eventsFromOpenAI = openAiResponse.data.choices[0].message.content;

    const result = {
      events: eventsFromOpenAI,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Error fetching events:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch event data.' }),
    };
  }
};


    // // Additional API calls (e.g., to another service for event weather)
    // const otherServiceResponse = await axios.get(`https://api.otherservice.com/events/weather`, {
    //   params: { location, apiKey: OTHER_API_KEY }
    // });

    // const weatherData = otherServiceResponse.data;

    // Combine results from different services
    // const result = {
    //   events: eventsFromOpenAI,
    //   weather: weatherData,
    // };