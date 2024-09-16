import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('A new client connected.');

    ws.on('message', async function incoming(message) {
        console.log('Received:', message);

        const sendCompletion = (completion, data = null) => {
            ws.send(JSON.stringify({ completion, data }));
        };

        // Perform 3 requests to the REST API
        let countryData = undefined;
        for (let i = 0; i < 20; i++) {
            try {
                const response = await fetch(`https://restcountries.com/v3.1/name/${message}?fullText=true`);
                const data = await response.json();
                countryData = data;

                // Update progress for each completed request
                sendCompletion((i + 1) * 5, i === 19 ? countryData : null);
            } catch (error) {
                console.error('API request failed', error);
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
