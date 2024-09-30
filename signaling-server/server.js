const WS = require('ws'); // WebSocket library
const http = require('http'); // HTTP library
const jwt = require('jsonwebtoken'); // JWT library
require('dotenv').config(); // Load environment variables

const server = http.createServer(); // Create an HTTP server
const wss = new WS.Server({ server }); // Create a WebSocket server using the HTTP server
const clients = new Map(); // Map to store connected clients

const SECRET_KEY = process.env.SECRET_KEY; // Use the secret key from environment variables

wss.on('connection', (ws) => {
    const id = Math.random().toString(36).substr(2, 9); // Unique client ID
    clients.set(ws, id); // Store the client in the map

    console.log(`Client connected: ${id}`);

    // Welcome message
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    // Listen for messages
    ws.on('message', (message) => {
        console.log(`Received message from ${id}: ${message}`);
        
        const parsedMessage = JSON.parse(message);
        
        if (parsedMessage.type === 'getToken') {
            const token = jwt.sign({ uid: id }, SECRET_KEY, { expiresIn: '1h' }); // Generate a token
            ws.send(JSON.stringify({ type: 'token', token }));
        } else {
            // Broadcast to all clients except the sender
            clients.forEach((clientId, client) => {
                if (client !== ws) {
                    client.send(JSON.stringify({ id, message }));
                }
            });
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log(`Client disconnected: ${id}`);
        clients.delete(ws); // Remove the client on disconnect
    });
});

// Use the port provided by Render or default to 8080
const PORT = process.env.PORT || 8080; 
server.listen(PORT, () => {
    console.log(`WebSocket server running on wss://your-deployed-url`);
});
