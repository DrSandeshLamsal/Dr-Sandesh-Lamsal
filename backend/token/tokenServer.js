const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 3000;

// Use environment variables for sensitive information
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.get('/rtcToken', (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0; // User ID
  const role = RtcRole.PUBLISHER; // Or SUBSCRIBER
  const expirationTimeInSeconds = 3600; // Token expiration time (1 hour)
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTime + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
