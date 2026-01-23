// Vercel entry point - wraps app.js for serverless deployment
const app = require('./app');

// Export the Express app as a serverless function
const serverless = require('serverless-http');
module.exports = serverless(app);

