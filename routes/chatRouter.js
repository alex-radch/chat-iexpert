const express = require('express');
const router = express.Router();

const ctrlChat = require('../controllers/chatController');

router.get('/', ctrlChat.chat);
router.get('/im/:userid', ctrlChat.chatwith);
router.post('/im/:userid/send', ctrlChat.tochat);
// router.get('/im:', ctrlChat.chat);

module.exports = router;
