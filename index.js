require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const gadgetRoutes = require('./routes/gadgets');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/gadgets', gadgetRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.sync();
        console.log('Database connected');
        // Add host/IP binding for Render
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();