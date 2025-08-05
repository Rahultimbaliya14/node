const router = require("./router/api");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config({ path: ".env" });

const app = require("express")();
app.use(bodyParser.json());
// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use('/api', router);

module.exports = app;