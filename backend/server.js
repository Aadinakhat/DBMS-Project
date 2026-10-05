const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// Root welcome route
app.get('/', (req, res) => {
    res.json({
        name: 'Automatic Lab Allocation System API',
        version: '1.0.0',
        documentation: '/api/health',
        showcase: '/api/dbms/queries'
    });
});

// Mount API routes
app.use('/api', apiRoutes);

// Catch 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.originalUrl} not found`
    });
});

// Central MySQL & Application Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Automatic Lab Allocation System API`);
    console.log(` Running on: http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Showcase queries: http://localhost:${PORT}/api/dbms/queries`);
    console.log(`====================================================`);
});

module.exports = { app, server };
