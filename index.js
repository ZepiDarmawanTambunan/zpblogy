// PACKAGE
import dotenv from 'dotenv';
import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// ROUTES
import testingRouter from './routes/testing.js';
import rolesRouter from './routes/roles.js';

dotenv.config();
const app = express();
app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARES
// izinkan agar react bisa akses http://localhost:5000/gambar.png diupload /public
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES & MIDDLEWARE
app.use('/testing', testingRouter);
app.use('/api/role', rolesRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(3000, () => {
    console.log('server is running');
});