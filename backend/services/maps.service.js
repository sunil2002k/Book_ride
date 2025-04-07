import axios from 'axios';
import captainModel from '../models/captain.model.js';

const getAddressCoordinates = async (address) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const coordinates = response.data.results[0].geometry.location;
            return { ltd: coordinates.lat, lng: coordinates.lng };
        } else {
            throw new Error('Unable to find address');
        }
    } catch (error) {
        console.error('Error fetching address coordinates:', error);
        throw error;
    }
}

const getDistanceTime = async (origin, destination) => {
    if(!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        }  else {
            throw new Error('Unable to find distance and time');
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        throw error;
    }
}

const getAutoCompleteSuggestions =async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getCaptainsInTheRadius =  async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}

export default {getAddressCoordinates, getDistanceTime, getAutoCompleteSuggestions, getCaptainsInTheRadius};