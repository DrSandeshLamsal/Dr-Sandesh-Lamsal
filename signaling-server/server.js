const WebSocket = require('ws');

// Create a new WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map(); // Map to store connected clients

wss.on('connection', (ws) => {
    const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID for the client
    clients.set(ws, id);

    console.log(`Client connected: ${id}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`Received message from ${id}:`, data);

            // Broadcast the received message to all clients except the sender
            clients.forEach((clientId, client) => {
                if (client !== ws) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${id}`);
        clients.delete(ws); // Remove the client from the map on disconnect
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for client ${id}:`, error);
    });
});

// Handle server termination gracefully
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    wss.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

console.log('Signaling server running on ws://localhost:8080');
