const path = require('path');

module.exports.signin = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, '../public', 'signin.html'));
  }
};

module.exports.signup = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, '../public', 'registration.html'));
  }
};
