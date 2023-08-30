const User = require('../models/UserModel');
const infoSuccess = 'card-success';
const infoError = 'card-error';
const urlSuccess = '/admin';
const fs = require('fs').promises; // Menggunakan versi async fs
const path = require('path');

class AdminController{
    async getAllUsers(req,res){
        try {
            const user = await User.findAll();
            const jumlahUser = await User.count({
                where: {
                    role: 'user'
                }
            })
            return res.render('admin/admin',{user, jumlahUser});
        } catch (error) {
            
        }
    }

    async deleteUser(req,res){
        const uuid = req.params.uuid;
        try {
            const user = await User.findOne({
                where: {
                    uuid: uuid
                }
            });
    
            const namaqr = user.qr; // Ambil nama QR dari user

        // Hapus gambar QR dari direktori
        const qrImagePath = path.join(__dirname, '..', 'public', 'qr', namaqr);

        // Periksa apakah gambar ada sebelum dihapus
        try {
            await fs.access(qrImagePath, fs.constants.F_OK);
            await fs.unlink(qrImagePath); // Menggunakan fungsi async unlink
        } catch (error) {
            // Tangani kesalahan jika file tidak ditemukan
        }

        // Hapus pengguna dari basis data

            await User.destroy({
                where: {
                    uuid: uuid
                }
            })
    
            const msg = 'Deleted user successfully';
            return res.render('pesan', { msg: msg, url: urlSuccess, info: infoSuccess });
        } catch (error) {
            console.error('Error during user deletion:', error);
            const msg = 'Internal Server Error';
            return res.render('pesan', { msg: msg, url: urlSuccess, info: infoError });
        }
    }

    async deleterAllUsers(req,res){
        try {
            const user = await User.destroy({
                where:{
                    role: 'user'
                }
            });
            if(!user){
                const msg = 'deleted user failed';
                return res.render('pesan', { msg: msg, url: urlSuccess, info: infoSuccess });
            }
            const msg = 'deleted user successfully';
            return res.render('pesan', { msg: msg, url: urlSuccess, info: infoSuccess });
        } catch (error) {
            console.error('Error during registration:', error);
            const msg = 'Internal Server Error';
            return res.render('pesan', { msg: msg, url: urlError, info: infoError });
        }
    }
}

module.exports = new AdminController();