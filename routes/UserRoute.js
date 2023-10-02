const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const UserMiddleware = require('../middleware/UserMiddleware');
const ScannerController = require('../controller/ScannerController');
const AdminController = require('../controller/AdminController');

router.get('/', UserMiddleware.isguest, (req, res) => {
    res.render('index');
});

router.get('/signupform', UserMiddleware.isguest,(req, res)=>{
    res.render('form');
});

router.post('/register', UserMiddleware.isguest, UserMiddleware.isCekCountUser, UserController.register);
router.post('/login', UserMiddleware.isguest, UserController.login);
router.get('/profile', UserMiddleware.islogin, UserController.profile);
router.get('/logout', UserMiddleware.islogin, UserController.logout);

router.get('/scanner', (req, res) => {
    res.render('scanner/scanner1')
});
router.get('/scan', (req, res) => {
    res.render('scanner/scan')
});
router.get('/scanner/:uuid', UserMiddleware.isscanner, ScannerController.getUser);
router.post('/scanner/:uuid', UserMiddleware.isscanner, ScannerController.updateUser);

router.get('/admin', UserMiddleware.isadmin, AdminController.getAllUsers);
router.get('/admin/delete/:uuid', UserMiddleware.isadmin, AdminController.deleteUser);
router.get('/admin/delete', UserMiddleware.isadmin, AdminController.deleterAllUsers);



router.use((req, res) => {
    res.render('404/404'); // Menggunakan res.render untuk merender halaman 404
});

module.exports = router;
