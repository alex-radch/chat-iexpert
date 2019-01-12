const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: 'Введите ваше имя'
  },
  lastName: {
    type: String,
    required: 'Введите вашу фамилию'
  },
  email: {
    type: String,
    required: 'Почта должна быть заполнена',
    unique: true
  },
  phone: {
    type: String,
    required: 'Телефон должен быть заполнен'
  },
  password: {
    type: String,
    required: 'Пароль должен быть заполнен',
    minlength: [4, 'Пароль должен содержать не менее 4 символов']
  },
  role: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  saltSecret: String
});

var expertSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: 'Введите ваше имя'
  },
  lastName: {
    type: String,
    required: 'Введите вашу фамилию'
  },
  email: {
    type: String,
    required: 'Почта должна быть заполнена',
    unique: true
  },
  phone: {
    type: String,
    required: 'Телефон должен быть заполнен'
  },
  password: {
    type: String,
    required: 'Пароль должен быть заполнен',
    minlength: [4, 'Пароль должен содержать не менее 4 символов']
  },
  role: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  saltSecret: String
});

expertSchema
  .virtual('fullName')
  .get(function() {
    return this.firstName + ' ' + this.lastName;
  })
  .set(function(v) {
    this.firstName = v.substr(0, v.indexOf(' '));
    this.lastName = v.substr(v.indexOf(' ') + 1);
  });

customerSchema
  .virtual('fullName')
  .get(function() {
    return this.firstName + ' ' + this.lastName;
  })
  .set(function(v) {
    this.firstName = v.substr(0, v.indexOf(' '));
    this.lastName = v.substr(v.indexOf(' ') + 1);
  });

// Validation for email
customerSchema.path('email').validate(val => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Неправильный email');

expertSchema.path('email').validate(val => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Неправильный email');

// Authenticate input against database
customerSchema.statics.authenticate = function(email, password, callback) {
  Customer.findOne({ email: email }).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error('Пользователь не найден');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

expertSchema.statics.authenticate = function(email, password, callback) {
  Expert.findOne({ email: email }).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error('Пользователь не найден');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

// Events
customerSchema.pre('save', function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

expertSchema.pre('save', function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

var Customer = mongoose.model('Customer', customerSchema, 'customers');
var Expert = mongoose.model('Expert', expertSchema, 'experts');

module.exports = Customer;
module.exports = Expert;
