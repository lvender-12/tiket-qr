const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        uniqen: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    qr:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    hadir:{
        type: DataTypes.STRING,
    },
    makanSiang:{
        type: DataTypes.STRING,
    },
    snack:{
        type: DataTypes.STRING,
    }
});


module.exports = User;