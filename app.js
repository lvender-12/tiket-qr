require('dotenv').config();
const express = require('express');
const ip = require('ip');
const routes = require('./routes/UserRoute');
const path = require('path');
const db = require('./config/database')
const UserModel = require('./models/UserModel') 
const bodyParser = require('body-parser');
const session = require('express-session');

const port = process.env.PORT || 3000;
const app = express();
const ipA = ip.address()

// db.sync()
//   .then(() => {
//     console.log('Tables created');
//   })
//   .catch((error) => {
//     console.error('Error creating tables:', error);
//   });

app.use(session({
    secret: process.env.SECRET_KEY, // Ganti dengan secret key yang lebih aman
    resave: false,
    saveUninitialized: true,
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.listen(port, ()=>{
    console.log(`Server running on port http://${ipA}:${port}/` || `server running on port http://localhost:${port}/`);
});