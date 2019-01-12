const express = require('express');
const router = express.Router();

const ctrlClient = require('../controllers/clientController');

router.get('/signin', ctrlClient.signin);
router.get('/signup', ctrlClient.signup);

module.exports = router;
