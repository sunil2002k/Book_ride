import axios from 'axios';
import captainModel from '../models/captain.model.js';

const getAddressCoordinates = async (address) => {
    const apiKey = process.env.OPENCAGE_API_KEY; // Add your OpenCage API key to .env
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
            q: address,
            key: apiKey,
        },
    });

    if (response.data.results.length > 0) {
        const { ltd, lng } = response.data.results[0].geometry;
        return { ltd, lng };
    } else {
        throw new Error('Coordinates not found');
    }
};

const getDistanceTime = async (origin, destination) => {
    const apiKey = process.env.OPENROUTESERVICE_API_KEY; // Add your OpenRouteService API key to .env
    const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
            coordinates: [origin, destination],
        },
        {
            headers: {
                Authorization: apiKey,
            },
        }
    );

    const { distance, duration } = response.data.routes[0].summary;
    return { distance, duration };
};

const getAutoCompleteSuggestions = async (input) => {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
            q: input,
            format: 'json',
            addressdetails: 1,
            limit: 5,
        },
    });

    return response.data.map((item) => ({
        name: item.display_name,
        coordinates: {
            ltd: parseFloat(item.lat),
            lng: parseFloat(item.lon),
        },
    }));
};
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