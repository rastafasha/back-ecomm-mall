// Vercel entry point - exports the handler from app.js
const app = require('./app');
const serverless = require('serverless-http');

// Export the handler for Vercel serverless functions
module.exports.handler = serverless(app);

