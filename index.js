require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const gadgetRoutes = require('./routes/gadgets');

const app = express();


// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5176/imf-gadgets-dashboards/', 'https://yadnyeshkolte.github.io/imf-gadgets-dashboards/'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/gadgets', gadgetRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.sync();
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();