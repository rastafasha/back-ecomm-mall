// Load environment variables FIRST - before any other requires
require('dotenv').config();

const app = require('./app');
const serverless = require('serverless-http');

// Create the serverless handler
const handler = serverless(app);

// Export the handler for Vercel serverless functions
module.exports.handler = async (event, context) => {
    // Handle CORS preflight requests for OPTIONS method
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
                'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                'Access-Control-Max-Age': '86400',
            },
            body: '',
        };
    }
    
    // Handle the actual request
    return handler(event, context);
};

