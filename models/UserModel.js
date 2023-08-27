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
        validate:{
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [8]
        }
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
        defaultValue: 'belum',
    },
    makanSiang:{
        type: DataTypes.STRING,
        defaultValue: 'belum',
    },
    snack:{
        type: DataTypes.STRING,
        defaultValue: 'belum',
    }
});


module.exports = User;