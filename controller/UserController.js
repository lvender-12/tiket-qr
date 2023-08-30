const User = require('../models/UserModel');
const argon = require('argon2');
const qr = require('qrcode');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const ip = require('ip');
const port = process.env.PORT || 3000;
const ipA = ip.address();
const infoSuccess = 'card-success';
const infoError = 'card-error';

class UserController {
    async register(req, res) {
        const { username, email, password } = req.body;
        const urlError = '/signupform/';
        try {
            const cekEmail = await User.findOne({
                where: {
                    email: email,
                },
            });
            if (username == null || email == null || password == null) {
                const msg = 'Please fill all fields';
                return res.render('pesan', { msg: msg, url: urlError, info: infoError });
                // return res.status(400).json({ msg: 'Please fill all fields' });
            } else if (password.length < 8) {
                const msg = 'Password must be at least 8 characters';
                return res.render('pesan', { msg: msg, url: urlError, info: infoError });
                // return res.status(400).json({ msg: 'Password must be at least 8 characters' });
            } else if (cekEmail) {
                const msg = 'Email already exists';
                return res.render('pesan', { msg: msg, url: urlError, info: infoError });
                // return res.status(400).json({ msg: 'Email already exists' });
            }

            const now = dayjs();
            const date = now.format('YYYYMMDDHHmmss');
            const nameqr = `${email}_${date}.png`;

            const hashPassword = await argon.hash(password);

            await User.create({
                username: username,
                email: email,
                password: hashPassword,
                qr: nameqr,
            });

            const userWithEmail = await User.findOne({
                where: {
                    email: email,
                },
            });

            if (!userWithEmail) {
                const msg = 'Failed to create user';
                return res.render('pesan', { msg: msg, url: urlError, info: infoError });
                // return res.status(500).json({ msg: 'Failed to create user' });
            }

            const uuid = userWithEmail.uuid; // Mengambil UUID dari user yang baru saja dibuat

            const isiqr = `http://${ipA}:${port}/scanner/${uuid}`;

            const qrCodePath = path.join(__dirname, '../public/qr', nameqr);

            // Menggunakan promisify untuk menunggu qr.toFile selesai
            const toFilePromise = require('util').promisify(qr.toFile);
            await toFilePromise(qrCodePath, isiqr);

            const transporter = nodemailer.createTransport({
                service: process.env.MAIL_SERVICE,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.MAIL_USER,
                to: email,
                subject: 'Registration Confirmation',
                text: `Thank you for registering!\n\nUsername: ${username}\nEmail: ${email}`,
                attachments: [
                    {
                        filename: nameqr,
                        path: qrCodePath,
                    },
                ],
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
            const msg = 'User registered successfully';
            return res.render('pesan', { msg: msg, url: urlError, info: infoSuccess });
            // return res.status(201).json({ msg: 'User registered successfully' });
        } catch (error) {
            console.error('Error during registration:', error);
            const msg = 'Internal Server Error';
            return res.render('pesan', { msg: msg, url: urlError, info: infoError });
            // return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        const urlError = '/signupform/';
        const urlSuccess = '/profile/';
    
        try {
            if (email === null || password === null) {
                const msg = 'Please fill all fields';
                return res.render('pesan', { msg: msg, url: urlError, info: infoError });
            }
    
            const user = await User.findOne({
                where: {
                    email: email,
                },
            });
    
            if (!user) {
                const msg = 'Email not found';
                return res.render('pesan', { msg: msg, url: urlError, info: infoError });
            }
    
            const match = await argon.verify(user.password, password); // Perhatikan penggunaan "await" di sini
    
            if (!match) {
                const msg = 'Password is wrong';
                return res.render('pesan', { msg: msg, url: urlError, info: infoError });
            }
    
            req.session.uuid = user.uuid;
            const userRole = user.role;

            const msg = 'login success';
            return res.render('pesan', { msg: msg, url: urlSuccess, info: infoSuccess, userRole: userRole});
            
        } catch (error) {
            console.error('Error during login:', error);
            const msg = 'Internal Server Error';
            return res.render('pesan', { msg: msg, url: urlError, info: infoError });
        }
    }

    async profile(req,res){
        const uuid = req.session.uuid;
        if (!uuid) {
            const msg = ' please login ';
            return res.render('pesan', { msg: msg, url: '/' });
        }
        const user = await User.findOne({
            where: {
                uuid: uuid,
            },
        });
        if (!user) {
            const msg = 'User not found';
            return res.render('pesan', { msg: msg, url: '/' });
        }

        const infoUser = {
            username: user.username,
            email: user.email,
            qr: user.qr,
            role: user.role,
            hadir: user.hadir,
            makanSiang: user.makansiang,
            snack: user.snack,
        }
        return res.render('profile', { user: infoUser });
    }

    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                const msg = 'logged out successfully';
                return res.render('pesan', { msg: msg, url: '/', info: infoSuccess });
            }
        });
    }
}

module.exports = new UserController();
