const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017/iexpert',
  { useNewUrlParser: true }
);

var db = mongoose.connection;
module.exports = db;

require('./user');
require('./chatModel');
require('./messageModel');
