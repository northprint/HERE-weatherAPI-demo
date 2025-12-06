import { query } from '$app/server';
import * as v from 'valibot';

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

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }

        const result = await res.json();

        return {
            temp: result.current.temperature_2m,
            wind: result.current.wind_speed_10m,
            unit: result.current_units.temperature_2m
        };
    }
);