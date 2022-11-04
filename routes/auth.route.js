const express = require('express');
const router = express.Router();


const { login, register,test,usage } = require('../controllers/auth.controller');

router.route('/').get(usage);
router.route('/login').post(login);
router.route('/register').post(register);
router.route('/test').post(test);


module.exports = router;