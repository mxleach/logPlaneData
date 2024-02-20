

/// ORIGINAL CODE BELOW 

const axios = require('axios');
require('dotenv').config();

// readline for user-console input 
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

rl.question('Enter getRandomPlane() to track a random plane or logFlight(#) to track a flight of your choice: ', (input) => {
    if (input.startsWith('getRandomPlane')) {
        getRandomPlane();
    } else if (input.startsWith('logFlight')) {
        const flightNumber = input.match(/\((.*?)\)/)[1]; // will replicate entered
        logFlight(flightNumber);
    } else {
        console.log('Invalid input. Please try again');
        rl.close();
    }
});

// function to maintain format for responses regardless of function called

function formatFlightData(flight) {
    return JSON.stringify({
        flightNumber: flight.flight.iata || "n/a",
        airline: flight.airline.name || "n/a",
        departureIata: flight.departure.iata,
        arrivalIata: flight.arrival.iata,
        delay: flight.departure.delay ? "Yes" : "No",
        terminal: flight.departure.terminal || "n/a",
        gate: flight.departure.gate || "n/a",
        scheduledDeparture: flight.departure.scheduled || "n/a",
        estimatedDeparture: flight.departure.estimated || "n/a",
        actualDeparture: flight.departure.actual || "n/a",
        timezoneChange: (flight.departure.timezone !== flight.arrival.timezone) ? "Yes" : "No"
    }, null, 2); // Pretty print the JSON
}


// find data for a random plane
async function getRandomPlane() {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    try {
        const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_status=active&limit=10`;
        const response = await axios.get(url);
        const flights = response.data.data;
        if (flights.length > 0) {
            const randomFlight = flights[Math.floor(Math.random() * flights.length)];

            const randomFlightData = {
                 flightNumber: randomFlight.flight.iata || "n/a",
                    airline: randomFlight.airline.name || "n/a",
                    departureIata: randomFlight.departure.iata,
                    arrivalIata: randomFlight.arrival.iata,
                    delay: randomFlight.departure.delay ? "Yes" : "No",
                    terminal: randomFlight.departure.terminal || "n/a",
                    gate: randomFlight.departure.gate || "n/a",
                    scheduledDeparture: randomFlight.departure.scheduled || "n/a",
                    estimatedDeparture: randomFlight.departure.estimated || "n/a",
                    actualDeparture: randomFlight.departure.actual || "n/a",
                    timezoneChange: (randomFlight.departure.timezone !== randomFlight.arrival.timezone) ? "Yes" : "No"
                };
             console.log("Random Flight Data:", formatFlightData(randomFlight));
        } else {
            console.log('No flight data available');
        }
    } catch (error) {
        console.error('Error fetching flights data', error);
    }
};



// get specified flight data
 async function logFlight(flightNumber) {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    try {
        const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}&flight_status=active`;
        const response = await axios.get(url);
        const flight = response.data.data[0]; 
        if (flight) {

            const trackedFlight = flight;
            // flight data, same params as randomFlightData
            const specFlightData = {
                flightNumber: trackedFlight.flight.iata || "n/a",
                airline: trackedFlight.airline.name || "n/a",
                departureIata: trackedFlight.departure.iata,
               arrivalIata: trackedFlight.arrival.iata,
         delay: trackedFlight.departure.delay ? "Yes" : "No",
                terminal: trackedFlight.departure.terminal || "n/a",
                gate: trackedFlight.departure.gate || "n/a", 
                scheduledDeparture: trackedFlight.departure.scheduled || "n/a",
                estimatedDeparture: trackedFlight.departure.estimated || "n/a",
                actualDeparture: trackedFlight.departure.actual || "n/a",
                timezoneChange: (trackedFlight.departure.timezone !== trackedFlight.arrival.timezone) ? "Yes" : "No"
            };

            console.log("Specific Flight Data:", formatFlightData(flight));
        } else {
            console.log('No flight data found for flight number', flightNumber);
        }
    } catch (error) {
        console.error('Error fetching flight data', error);
    }
}



  