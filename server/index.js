
const express = require('express');
const cors = require('cors');
const { handleGoogleLensRequest } = require('./api/google-lens');

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: '50mb' }));

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Register the Google Lens API route
app.post('/api/google-lens', (req, res) => {
  console.log('Received request to /api/google-lens');
  handleGoogleLensRequest(req, res);
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API server is running' });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Google Lens endpoint available at http://localhost:${PORT}/api/google-lens`);
});
