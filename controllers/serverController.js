const mongoose = require('mongoose');

const Customer = mongoose.model('Customer');
const Expert = mongoose.model('Expert');

module.exports.register = (req, res, next) => {
  switch (req.body.role) {
    case 'customer':
      var customer = new Customer();
      customer.fullName = req.body.fullName;
      customer.email = req.body.email;
      customer.phone = req.body.phone;
      customer.password = req.body.password;
      customer.role = req.body.role;
      customer.save((err, doc) => {
        if (!err) {
          req.session.userId = doc._id;
          res.send(doc);
        } else {
          if (err.code == 11000)
            res
              .status(422)
              .send(['Пользователь с такой почтой уже зарегистрирован']);
          else return next(err);
        }
      });
      break;
    case 'expert':
      var expert = new Expert();
      expert.fullName = req.body.fullName;
      expert.email = req.body.email;
      expert.phone = req.body.phone;
      expert.password = req.body.password;
      expert.role = req.body.role;
      expert.save((err, doc) => {
        if (!err) {
          req.session.userId = doc._id;
          res.send(doc);
        } else {
          if (err.code == 11000)
            res
              .status(422)
              .send(['Пользователь с такой почтой уже зарегистрирован']);
          else return next(err);
        }
      });
      break;
  }
};

module.exports.signin = (req, res, next) => {
  if (req.body.logemail && req.body.logpassword && !req.session.userId) {
    Customer.findOne({ email: req.body.logemail }, function(err, user) {
      if (user !== null && user.role == 'customer') {
        Customer.authenticate(req.body.logemail, req.body.logpassword, function(
          error,
          user
        ) {
          if (error || !user) {
            var err = new Error('Не верная почта или пароль');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            console.log('Пользователь вошел в аккаунт');
            return res.send('/account/signup/');
          }
        });
      }
    });

    Expert.findOne({ email: req.body.logemail }, function(err, user) {
      if (user !== null && user.role == 'expert') {
        Expert.authenticate(req.body.logemail, req.body.logpassword, function(
          error,
          user
        ) {
          if (error || !user) {
            var err = new Error('Не верная почта или пароль');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            console.log('Эксперт вошел в аккаунт');
            return res.send('/account/signup/');
          }
        });
      }
    });
  } else {
    var err = new Error('Заполните оба поля');
    err.status = 400;
    return next(err);
  }
};

// GET for logout logout
module.exports.logout = (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        console.log('Пользователь вышел из аккаунта');
        return res.redirect('/');
      }
    });
  }
};
