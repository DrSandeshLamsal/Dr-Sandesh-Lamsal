const WebSocket = require('ws');

// Create a new WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map(); // Map to store connected clients

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID for the client
  clients.set(ws, id);

  ws.on('message', (message) => {
    // Broadcast the received message to all clients except the sender
    clients.forEach((clientId, client) => {
      if (client !== ws) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws); // Remove the client from the map on disconnect
  });
});

console.log('Signaling server running on ws://localhost:8080');
