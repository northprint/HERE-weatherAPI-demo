import { query } from '$app/server';
import * as v from 'valibot';
import { HERE_API_KEY } from '$env/static/private';

const CoordinatesSchema = v.object({
    lat: v.number(),
    lng: v.number()
});

export const getWeather = query(
    CoordinatesSchema,
    async (data: any) => {

        const lat = data?.lat;
        const lng = data?.lng;

        if (!lat || !lng) {
            throw new Error('Missing coordinates');
        }

        const apiKey = HERE_API_KEY;
        const url = `https://weather.hereapi.com/v3/report?products=observation&location=${lat},${lng}&lang=ja-JP&apiKey=${apiKey}`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }

        const result = await res.json();
        const mainLocation = result.places?.[0];
        const observation = mainLocation?.observations?.[0];

        if (!observation) {
            throw new Error('No observation data found');
        }

        return {
            temp: observation.temperature,
            description: observation.description, // e.g. "所々晴れ間が覗く、曇り. 涼しい."
            skyDesc: observation.skyDesc,         // e.g. "所々晴れ間が覗く、曇り"
            humidity: observation.humidity,
            windSpeed: observation.windSpeed,
            windDirection: observation.windDirection,
            windDesc: observation.windDesc,       // e.g. "北"
            iconLink: observation.iconLink,
            city: observation.place?.address?.city || 'Unknown Location',
            time: observation.time
        };
    }
);