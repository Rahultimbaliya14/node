const router = require("./router/api");
const routerAuth = require("./router/auth");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config({ path: ".env" });

const app = require("express")();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', router);
app.use('/auth', routerAuth);

module.exports = app;