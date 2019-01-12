require('./models/db');
const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const socket = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const exphbs = require('express-handlebars');
const db = require('./models/db');
const rtsServer = require('./routes/serverRouter');
const rtsClient = require('./routes/clientRouter');
const rtsChat = require('./routes/chatRouter');

//App setup
const app = express();

// Сессии
app.use(
  session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new mongoStore({
      mongooseConnection: db
    }),
    cookie: {
      maxAge: 604800000
    }
  })
);

// Шаблонизатор
app.set('views', __dirname + '/public/handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'chat' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(cors());
app.use('/api', rtsServer);

// Переход на страницу входа и регистрации
app.use('/account', rtsClient);

// Контроль чатов
app.use('/chat', rtsChat);

//error handler
app.use((err, req, res, next) => {
  if (err.name == 'ValidationError') {
    var valErrors = [];
    Object.keys(err.errors).forEach(key =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).send(valErrors);
  }
});

// Запуск сервера
var server = app.listen(4000, function() {
  console.log('listening to requrest on port 4000');
});

// Static files
app.use(express.static('public'));

// Socket setup
var io = socket(server);

io.on('connection', function(socket) {
  console.log('made socket connection ' + socket.id);

  //Handle chat event
  socket.on('chat', function(data) {
    console.log(data);
    io.sockets.emit('chat', data);
  });

  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', data);
  });

  socket.on('stopTyping', function(data) {
    socket.broadcast.emit('stopTyping', data);
  });
});
