const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gadget = sequelize.define('Gadget', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codename: {
        type: DataTypes.STRING,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('Available', 'Deployed', 'Destroyed', 'Decommissioned'),
        defaultValue: 'Available'
    },
    missionSuccessProbability: {
        type: DataTypes.INTEGER
    },
    decommissionedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = Gadget;