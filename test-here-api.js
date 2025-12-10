
import 'dotenv/config';
const apiKey = process.env.HERE_API_KEY;
const lat = 35.68;
const lng = 139.7666;
const url = `https://weather.hereapi.com/v3/report?products=observation&location=${lat},${lng}&lang=ja-JP&apiKey=${apiKey}`;

console.log(`Fetching: ${url}`);

fetch(url)
    .then(res => {
        if (!res.ok) {
            throw new Error(`Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        // console.log('Raw:', JSON.stringify(data, null, 2));
        const observation = data.places?.[0]?.observations?.[0];
        if (observation) {
            console.log('Temp:', observation.temperature);
            console.log('City:', observation.place?.address?.city);
        } else {
            console.error('No observation!');
        }
    })
    .catch(err => console.error('Error:', err));
