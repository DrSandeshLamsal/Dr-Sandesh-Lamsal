const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Load the private key from the file system
const privateKey = fs.readFileSync('./private.key', 'utf8');

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Route to generate a JWT token
app.post('/generate-token', (req, res) => {
  // Payload for the JWT token
  const payload = {
    aud: 'vpaas-magic-cookie-ba19d1a037ed4b5186abbda7ae5cfa00', // Your App ID
    iss: 'vpaas-magic-cookie-ba19d1a037ed4b5186abbda7ae5cfa00', // Issuer (your App ID)
    sub: 'meet.jit.si', // Jitsi domain or tenant
    room: 'Talk With Dr. Sandesh Lamsal', // Specify the room name or '*' for all rooms
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expiry (1 hour from now)
    context: {
      user: {
        avatar: 'https://www.drsandesh.com.np/assets/img/DrSandesh.ico',
        name: 'Participant Name',
        email: 'user@example.com'
      },
      features: {
        livestreaming: 'true',
        recording: 'true',
        transcription: 'true'
      }
    }
  };

  // Options for JWT sign
  const options = {
    algorithm: 'RS256', // Use RS256 for RSA private keys
  };

  // Generate the token
  const token = jwt.sign(payload, privateKey, options);

  // Output the token
  res.json({ token });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

