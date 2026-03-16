import axios from 'axios';

export const reverseGeocode = async (lat: number, lng: number) => {
    try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    lat,
                    lon: lng,
                    format: 'json'
                },
                headers: {
                    "User-Agent": "ride-app"
                }
            }
        );
        return res.data.display_name || null;
    } catch (error) {
        return null;
    }
}