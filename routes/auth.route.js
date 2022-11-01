const express = require('express');
const router = express.Router();


const { login, register,test } = require('../controllers/auth.controller');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/test').post(test);


module.exports = router;