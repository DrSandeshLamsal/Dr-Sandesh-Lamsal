const WS = require('ws'); // Renamed WebSocket to WS
const http = require('http');

// Create an HTTP server to integrate with the WebSocket server
const server = http.createServer();
const wss = new WS.Server({ server }); // Use the HTTP server for WebSocket connections
const clients = new Map(); // Map to store connected clients

wss.on('connection', (ws) => {
    const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID for the client
    clients.set(ws, id);

    console.log(`Client connected: ${id}`);

    // Send a welcome message to the newly connected client
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    // Listen for incoming messages
    ws.on('message', (message) => {
        console.log(`Received message from ${id}: ${message}`);

        // Broadcast the received message to all clients except the sender
        clients.forEach((clientId, client) => {
            if (client !== ws) {
                client.send(JSON.stringify({ id, message }));
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log(`Client disconnected: ${id}`);
        clients.delete(ws); // Remove the client from the map on disconnect
    });
});

// Make sure to listen on the port provided by Render
const PORT = process.env.PORT || 8080; // Use the Render-provided port or default to 8080
server.listen(PORT, () => {
    console.log(`WebSocket server running on wss://your-deployed-url`);
});
