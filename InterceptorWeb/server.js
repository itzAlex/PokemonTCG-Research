// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Global variables
let interceptOn = true; // Intercept switch status
let pendingRequests = {}; // Store pending requests

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the current intercept status to the client
  socket.emit('interceptStatus', interceptOn);

  // Handle intercept switch toggle
  socket.on('toggleIntercept', (status) => {
    interceptOn = status;
    console.log(`Intercept is now ${interceptOn ? 'ON' : 'OFF'}`);
  });

  // Handle modified JSON from frontend
  socket.on('modifiedJson', ({ requestId, modifiedJson }) => {
    if (pendingRequests[requestId]) {
      pendingRequests[requestId](modifiedJson);
      delete pendingRequests[requestId];
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// API endpoint
app.post('/intercept', async (req, res) => {
  let { jsonData, title } = req.body;
  const requestId = generateUniqueId();

  if (typeof jsonData === 'string') {
    // Parse jsonData if it's a string
    try {
      jsonData = JSON.parse(jsonData);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON data' });
    }
  }

  if (!interceptOn) {
    // If intercept is OFF, return the original JSON immediately
    return res.json({ modifiedJson: jsonData });
  }

  // Send data to frontend via Socket.io
  io.emit('interceptData', { requestId, jsonData, title });

  // Wait for the modified JSON
  try {
    const modifiedJson = await waitForModifiedJson(requestId);
    res.json({ modifiedJson });
  } catch (error) {
    res.status(500).send({ error: 'Timeout or error receiving modified JSON' });
  }
});

// Helper functions
function waitForModifiedJson(requestId) {
  return new Promise((resolve, reject) => {
    pendingRequests[requestId] = resolve;
    // Timeout after 60 seconds
    setTimeout(() => {
      if (pendingRequests[requestId]) {
        reject(new Error('Timeout'));
        delete pendingRequests[requestId];
      }
    }, 60000);
  });
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
