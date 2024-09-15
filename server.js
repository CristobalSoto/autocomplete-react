const WebSocket = require('ws');
const fetch = require('node-fetch');  // Make sure you have node-fetch installed

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('A new client connected.');

    ws.on('message', async function incoming(message) {
        console.log('Received:', message);

        const sendCompletion = (completion, data = null) => {
            ws.send(JSON.stringify({ completion, data }));
        };

        // Perform 3 requests to the REST API
        let allData = [];
        for (let i = 0; i < 3; i++) {
            try {
                const response = await fetch(`https://restcountries.com/v3.1/name/${message}?fullText=true`);
                const data = await response.json();
                allData.push(...data);

                // Update progress for each completed request
                sendCompletion((i + 1) * 33, i === 2 ? allData : null);
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
