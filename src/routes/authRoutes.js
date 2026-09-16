const express = require('express');
const { verifyLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/login', verifyLogin);

module.exports = router;