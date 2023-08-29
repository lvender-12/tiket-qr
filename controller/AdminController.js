const User = require('../models/UserModel');
const infoSuccess = 'card-success';
const infoError = 'card-error';

class AdminController{
    async getAllUsers(req,res){
        try {
            const user = await User.findAll();
            const jumlahUser = await User.count({
                where: {
                    role: 'user'
                }
            })
            return res.render('admin',{user, jumlahUser});
        } catch (error) {
            
        }
    }

    async deleteUser(req,res){
        const uuid = req.params.uuid;
        const urlSuccess = '/admin';
        try {
            const user = await User.destroy({
                where: {
                    uuid: uuid
                }
            });
            const msg = 'deleted user successfully';
                return res.render('pesan', { msg: msg, url: urlSuccess, info: infoSuccess });
        } catch (error) {
            
        }
    }
}

module.exports = new AdminController();