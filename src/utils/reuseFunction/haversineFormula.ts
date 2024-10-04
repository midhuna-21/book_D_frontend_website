import axios from 'axios';

const key = 'AIzaSyD06G78Q2_d18EkXbsYsyg7qb2O-WWUU-Q';

export const calculateRoadDistance = async (lat1: number, lon1: number, lat2: number, lon2: number): Promise<number | null> => {
    const origin = `${lat1},${lon1}`;
    const destination = `${lat2},${lon2}`;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${key}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        
        if (data.status === "OK") {
            const distance = data.rows[0].elements[0].distance.value; 
            return distance / 1000; 
        } else {
            console.error('Error in Google Maps API response:', data.error_message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching road distance:', error);
        return null;
    }
};
