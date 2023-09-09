// nodejs_script.js
const axios = require('axios');

// Define the URL of your Flask server
const apiUrl = 'http://localhost:5000/'; // Update the URL if needed

// Make a GET request to the Flask API
axios.get(apiUrl)
  .then((response) => {
    console.log('Response from Flask API:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

