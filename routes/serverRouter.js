const express = require('express');
const router = express.Router();

const ctrlServer = require('../controllers/serverController');

router.post('/register', ctrlServer.register);
router.post('/signin', ctrlServer.signin);
router.get('/logout', ctrlServer.logout);

module.exports = router;
