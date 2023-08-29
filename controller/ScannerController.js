const User = require('../models/UserModel');
const infoSuccess = 'card-success';
const infoError = 'card-error';
class ScannerController {
    async getUser(req,res){
        const uuid = req.params.uuid;
        try {
            const urlError = '/profile/'
            if(!uuid){
                const msg = 'tidak ada uuid dan tidak dapat melanjutkan';
                return res.render('pesan', { msg: msg, url: urlError });
            }
            const user = await User.findOne({
                where:{
                    uuid: uuid
                }
            });
            if(!user){
                const msg = 'user tidak ditemukan';
                return res.render('pesan', { msg: msg, url: urlError });
            };

            const infoUser = {
                uuid: user.uuid,
                nama: user.nama,
                email: user.email,
                qr: user.qr,
                role: user.role,
                hadir: user.hadir,
                makanSiang: user.makanSiang,
                snack: user.snack
            }
            return res.render('scanner', { user: infoUser });
        } catch (error) {
            
        }
    }

    async updateUser(req,res){
        const { hadir, makanSiang, snack} = req.body;
        const uuid = req.params.uuid;
        console.log(uuid);
        const urlError = '/profile/'
        if(hadir === null || makanSiang === null || snack === null){
            const msg = 'tidak boleh kosong';
            return res.render('pesan', { msg: msg, url: urlError });
        }
        const user = await User.update(
            {
                hadir: hadir,
                makanSiang: makanSiang,
                snack: snack 
            },
            {
                where: {
                    uuid: uuid
                }
            }
        );        
        if(!user){
            const msg = 'update failed';
            return res.render('pesan', { msg: msg, url: urlError });
        };
        const msg = 'update succsesfully';
        return res.render('pesan', { msg: msg, url: '/profile', info: infoSuccess  });
    }
}

module.exports = new ScannerController();