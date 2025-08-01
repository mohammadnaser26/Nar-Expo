const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allows requests from your GitHub Pages domain
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all GitHub Pages domains and localhost
    const allowed = [
      'https://mohammadnaser26.github.io',
      'https://mohammadnaser26.github.io/Nar-Expo',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://localhost:8000'
    ];
    
    // Check if the origin is in the allowed list or is a GitHub Pages subdomain
    if (allowed.includes(origin) || origin.includes('mohammadnaser26.github.io')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ]
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Replace with your actual Google Apps Script URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwW5GQbhdBhAvnx_nOpMZXaaYjRcDB0_tFr1c5BxnlwRRGyxFZB2w6xb-jpUWuXLw/exec";

app.get('/', (req, res) => {
  res.json({ 
    status: 'Proxy server is running',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    origin: req.get('origin') || 'none'
  });
});

// Test endpoint for CORS verification
app.get('/test', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.get('origin') || 'none',
    timestamp: new Date().toISOString()
  });
});

app.post('/submit', async (req, res) => {
  try {
    console.log('Received submission from origin:', req.get('origin'));
    console.log('Received submission:', req.body);
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.text();
    console.log('Google Apps Script response:', result);

    if (response.ok) {
      res.json({ 
        success: true, 
        message: 'Data submitted successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`Google Apps Script error: ${response.status}`);
    }

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
