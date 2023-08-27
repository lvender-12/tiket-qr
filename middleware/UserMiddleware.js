const User = require('../models/UserModel');

class UserMiddleware {
    async isCekCountUser(req, res, next) {
        try {
            const user = await User.count({
                where: {
                    role: 'user'
                }
            });
            if(user <= 2500){
                next();
            }else{
                const msg = 'user full';
                return res.render('pesan', { msg: msg, url: '/' });
            }
        } catch (error) {
            console.log(error);
            const msg = 'internal server error';
            return res.render('pesan', { msg: msg, url: '/' });
        }
    }

    async islogin(req, res, next) {
        const uuid = await req.session.uuid;
        if(uuid){
            next();
        }else{
            const msg = 'not logged in';
            return res.render('pesan', { msg: msg, url: '/signupform/' });
        }
    }

    async isguest(req, res, next) {
        const uuid = await req.session.uuid;
        if(!uuid){
            next();
        }else{
            const msg = 'your logged in';
            return res.render('pesan', { msg: msg, url: '/profile/' });
        }
    }

    async isadmin(req, res, next) {
        const uuid = await req.session.uuid;
        const role = await User.findOne({
            where: {
                uuid: uuid
            }
        })
        if(role.role == 'admin'){
            next();
        }else{
            const msg = 'not administrator';
            return res.render('pesan', { msg: msg, url: '/profile/' });
        }
    }

    async isscanner(req, res, next) {
        const uuid = await req.session.uuid;
        const role = await User.findOne({
            where: {
                uuid: uuid
            }
        })
        if(role.role == 'scanner'){
            next();
        }else{
            const msg = 'not scanner';
            return res.render('pesan', { msg: msg, url: '/profile/' });
        }
    }
    async isuser(req, res, next) {
        const uuid = await req.session.uuid;
        const role = await User.findOne({
            where: {
                uuid: uuid
            }
        })
        if(role.role == 'user'){
            next();
        }else{
            const msg = 'not user';
            return res.render('pesan', { msg: msg, url: '/profile/' });
        }
    }
}

module.exports = new UserMiddleware();