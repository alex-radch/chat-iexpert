const mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'Покупатель не найден',
    ref: 'Customer'
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'Эксперт не найден',
    ref: 'Expert'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Chat', chatSchema, 'chats');
