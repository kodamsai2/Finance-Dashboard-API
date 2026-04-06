const express = require('express')
const rateLimit = require('express-rate-limit');

const authRoutes = require("./routes/auth.routes");
const configRoutes = require("./routes/config.routes");
const usersRoutes = require("./routes/user.routes");
const recordsRoutes = require("./routes/record.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express()

// Middleware
app.use(express.json())


// Rate limiters
const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per window
    handler: (req, res) => {
        res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
        });
    }
});
const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests from this IP, please try again after 15 minutes'
        });
    }
});


// API Routes
app.use('/api/v1/auth', authRateLimit, authRoutes)
app.use('/api/v1/config', generalRateLimit, configRoutes)
app.use('/api/v1/users', generalRateLimit, usersRoutes)
app.use('/api/v1/records', generalRateLimit, recordsRoutes)
app.use('/api/v1/dashboard', generalRateLimit, dashboardRoutes)


module.exports = app