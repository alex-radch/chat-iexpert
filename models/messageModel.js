const mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Chat'
  },
  message: { type: String, required: true },
  fromName: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'who'
  },
  who: { type: String, required: true, enum: ['expert', 'customer'] },
  created: { type: Date, default: Date.now }
});

mongoose.model('Message', messageSchema, 'messages');
