const mongoose = require('mongoose');

const Chat = mongoose.model('Chat');
const Message = mongoose.model('Message');
const Customer = mongoose.model('Customer');
const Expert = mongoose.model('Expert');

// module.exports.chatwith = async (req, res, next) => { For async-await hangling
module.exports.chatwith = (req, res, next) => {
  if (req.session.userId) {
    Chat.find(
      { customer: req.session.userId, expert: req.params.userid }, // Если в чат зашел Пользователь
      function(err, curchat) {
        if (curchat !== undefined && curchat.length == 0) {
          const chat = new Chat();
          const options = {};
          Customer.findById(req.session.userId, function(err, customer) {
            if (customer !== null && customer.role == 'customer') {
              chat.customer = customer._id;
              chat.expert = req.params.userid;
              console.log('С кем переписываемся: ' + req.params.userid);
              console.log('Кто начал чат: ' + req.session.userId);

              options.from = req.session.userId;
              options.to = req.params.userid;

              Expert.findById(req.params.userid, function(err, expert) {
                if (err) {
                  console.log(err);
                  return next(err);
                } else {
                  if (expert !== null && expert.role == 'expert') {
                    options.who = customer.role;
                    options.toName = expert.fullName;
                    options.fromName = customer.fullName;
                    chat.save((err, doc) => {
                      if (!err) {
                        //res.send(doc);
                      } else {
                        return next(err);
                      }
                    });
                    res.render('chat', {
                      layout: false,
                      options: options
                    });
                  }
                }
              });
            }
          });
        } else {
          if (curchat === undefined) {
            console.log('Произошла ошибка в поиске пользователей и экспертов');
          }
          if (curchat.length == 1) {
            const options = {};
            Message.find({ chatId: curchat[0]._id })
              .sort({ created: -1 })
              .limit(20)
              .exec(function(err, messages) {
                messages.sort({ created: -1 });
                Customer.findById(req.session.userId, function(err, customer) {
                  if (customer !== null && customer.role == 'customer') {
                    options.from = req.session.userId;
                    options.to = req.params.userid;
                    Expert.findById(req.params.userid, function(err, expert) {
                      if (err) {
                        console.log(err);
                        return next(err);
                      } else {
                        if (expert !== null && expert.role == 'expert') {
                          options.who = customer.role;
                          options.toName = expert.fullName;
                          options.fromName = customer.fullName;
                          res.render('chat', {
                            layout: false,
                            options: options,
                            messages: messages
                          });
                        }
                      }
                    });
                  }
                });
              });
          }
        }
      }
    );

    // ---------------------------------------------------------------------------------------------------------

    Chat.find(
      { customer: req.params.userid, expert: req.session.userId }, // Если в чат зашел Эксперт
      function(err, curchat) {
        if (curchat !== undefined && curchat.length == 0) {
          const chat = new Chat();
          const options = {};
          Customer.findById(req.params.userid, function(err, customer) {
            if (customer !== null && customer.role == 'customer') {
              chat.customer = customer._id;
              chat.expert = req.session.userId;
              console.log('С кем переписываемся: ' + req.params.userid);
              console.log('Кто начал чат: ' + req.session.userId);

              options.from = req.session.userId;
              options.to = req.params.userid;

              Expert.findById(req.session.userId, function(err, expert) {
                if (err) {
                  console.log(err);
                  return next(err);
                } else {
                  if (expert !== null && expert.role == 'expert') {
                    options.who = expert.role;
                    options.toName = customer.fullName;
                    options.fromName = expert.fullName;
                    chat.save((err, doc) => {
                      if (!err) {
                        //res.send(doc);
                      } else {
                        return next(err);
                      }
                    });
                    res.render('chat', {
                      layout: false,
                      options: options
                    });
                  }
                }
              });
            }
          });
        } else {
          if (curchat === undefined) {
            console.log('Произошла ошибка в поиске пользователей и экспертов');
          }
          if (curchat.length == 1) {
            const options = {};
            Message.find({ chatId: curchat[0]._id })
              .sort({ created: -1 })
              .limit(20)
              .exec(function(err, messages) {
                messages.sort({ created: -1 });
                Customer.findById(req.params.userid, function(err, customer) {
                  if (customer !== null && customer.role == 'customer') {
                    options.from = req.session.userId;
                    options.to = req.params.userid;
                    Expert.findById(req.session.userId, function(err, expert) {
                      if (err) {
                        console.log(err);
                        return next(err);
                      } else {
                        if (expert !== null && expert.role == 'expert') {
                          options.who = expert.role;
                          options.toName = customer.fullName;
                          options.fromName = expert.fullName;
                          res.render('chat', {
                            layout: false,
                            options: options,
                            messages: messages
                          });
                        }
                      }
                    });
                  }
                });
              });
          }
        }
      }
    );

    // Using promises ...
    // Expert.findById(req.params.userid)
    //   .then(user => {
    // if (user !== null && user.role == 'expert') {
    //   options.name = user.fullName.firstName + ' ' + user.fullName.lastName;
    //   console.log(options);
    //   res.render('chat', {
    //     layout: false,
    //     options: options
    //   });
    // }
    //   })
    //   .catch(err => console.log(err));

    // Используя try async await
    // try {
    //   const user = await Expert.findById(req.params.userid);
    //   if (user !== null && user.role == 'expert') {
    //     options.name = user.fullName.firstName + ' ' + user.fullName.lastName;
    //     console.log(options);
    //     res.render('chat', {
    //       layout: false,
    //       options: options
    //     });
    //   }
    // } catch (err) {
    //   console.log(err);
    // }

    // Using callback
    // Expert.findById(req.params.userid, function(err, user) {
    //   if (err) {
    //     console.log(err);
    //     return next(err);
    //   } else {
    //     if (user !== null && user.role == 'expert') {
    //       options.toName = user.fullName;
    //       Customer.findById(req.session.userId, function(err, from) {
    //         if (from !== null && from.role == 'customer') {
    //           options.fromName = from.fullName;
    //           console.log(options);
    //           res.render('chat', {
    //             layout: false,
    //             options: options
    //           });
    //         }
    //       });
    //     }
    //   }
    // });

    // Customer.findById(req.params.userid, function(err, user) {
    //   if (err) {
    //     console.log(err);
    //     return next(err);
    //   } else {
    //     if (user !== null && user.role == 'customer') {
    //       options.toName = user.fullName;
    //       Expert.findById(req.session.userId, function(err, from) {
    //         if (from !== null && from.role == 'expert') {
    //           options.fromName = from.fullName;
    //           console.log(options);
    //           res.render('chat', {
    //             layout: false,
    //             options: options
    //           });
    //         }
    //       });
    //     }
    //   }
    // });
  } else {
    res.redirect('/account/signin/');
  }
};

module.exports.chat = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  } else {
    res.redirect('/account/signin/');
  }
};

module.exports.tochat = (req, res, next) => {
  if (req.session.userId && req.body) {
    Chat.find(
      { customer: req.session.userId, expert: req.params.userid }, // Если отправляет сообщение Пользователь
      function(err, curchat) {
        if (curchat !== undefined && curchat.length == 1) {
          const msg = new Message({
            chatId: curchat[0]._id,
            message: req.body.message,
            fromName: req.body.fromName,
            from: req.body.from,
            who: req.body.who
          });
          //   console.log(msg);

          msg.save(function(err, doc) {
            if (!err) {
              console.log('Сообщение успешно отправлено!');
              res.send(doc);
              // ВОЗМОЖНО ЗДЕСЬ НУЖНО ОТПРАВИТЬ НА СЕРВЕР ЧТО-ТО ПРО УСПЕШНУЮ ОТПРАВКУ, чтобы закончить процесс
            } else return next(err);
          });
        } else {
          if (curchat === undefined) {
            console.log('Произошла ошибка в поиске пользователей и экспертов');
          }
        }
      }
    );

    Chat.find(
      { customer: req.params.userid, expert: req.session.userId }, // Если отправляет сообщение Эксперт
      function(err, curchat) {
        if (curchat !== undefined && curchat.length == 1) {
          const msg = new Message({
            chatId: curchat[0]._id,
            message: req.body.message,
            fromName: req.body.fromName,
            from: req.body.from,
            who: req.body.who
          });
          msg.save(function(err, doc) {
            if (!err) {
              console.log('Сообщение успешно отправлено!');
              res.send(doc);
            } else return next(err);
          });
        } else {
          if (curchat === undefined) {
            console.log('Произошла ошибка в поиске пользователей и экспертов');
          }
        }
      }
    );
  } else {
    res.redirect('/account/signin/');
    // здесь по идее можно узнать, откуда делался редирект, чтобы вернуть пользователя обратно после входа в аккаунт или регистрации
  }
};
