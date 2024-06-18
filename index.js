// PACKAGE
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// ROUTES
const testingRouter = require('./routes/testing');
const rolesRouter = require('./routes/roles');
const userRouter = require('./routes/users');
const refreshTokenRouter = require('./routes/refreshTokens');
const articleRouter = require('./routes/articles');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(logger('dev'));

// MIDDLEWARES
// Allow access to static files (e.g., images) in the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
const verifyToken = require('./middlewares/verifyToken');
const can = require('./middlewares/permission');

// ROUTES & MIDDLEWARE
app.use('/testing', testingRouter);
app.use('/api/role', verifyToken, can('master'), rolesRouter);
app.use('/api/user', userRouter);
app.use('/api/refresh-token', refreshTokenRouter);
app.use('/api/article', articleRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('server is running');
});

module.exports = app;