const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const db = require('./models/index');
const Users = db.user;

const app = express();
app.use(cors({ origin: true, credentials: true }));
const port = 4000;

const { check, validationResult } = require('express-validator');

require('date-utils');
const dt = new Date();

passport.use(new localStrategy(function (username, password, done) {
  Users.findOne({
    where: {
      username: username
    }
  }).then(user => {
    if (user === null) return done(null, false);
    if (bcrypt.compareSync(password, user.password))
      return done(null, user.id);
    return done(null, false);
  });
}));

const session = require("express-session")({
  secret: "da9AngZr5TTkwVxJcCbz25CaPH4HHLTFzMue2gezEr28Xfzuis",
  resave: false,
  saveUninitialized: false
});

app.use(session);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.listen(port);

const validateUsername = check('username').isString().isLength({ min: 1, max: 30 });
const validatePassword = check('password').isString().isLength({ min: 8, max: 30 });

app.get('/list', function (req, res) {
  Users.findAll({ attributes: ['username'] })
    .then(users => res.status(200).json(users));
});

app.get('/check', [
  validateUsername,
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    console.log(req.query.username);
    Users.count({
      where: {
        'username': req.query.username
      }
    })
      .then(count => res.status(200).json({
        'count': count
      }));
  }
});

app.get("/auth", function (req, res) {
  res.status(200).json({
    status: req.isAuthenticated()
  });
});

app.post("/login", passport.authenticate("local"), function (req, res) {
  res.status(200).json({
    message: "Login successfully."
  });
});

app.post("/register", [
  validateUsername,
  validatePassword
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  Users.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, saltRounds)
  });
  res.josn({
    message: "Complete to register."
  });
});

app.get("/mypage", function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log("user: " + req.user);
    next();
  } else {
    console.log("ログインされてない");
    res.status(401).json({
      message: 'Please login.'
    });
  }
}, function (req, res) {
  Users.findOne({
    attributes: [
      'username'
    ],
    where: {
      id: req.user
    }
  }).then(user => {
    console.log(user);
    res.json({
      username: user.username
    })
  });
});

app.post("/change", function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log("user: " + req.user);
    next();
  } else {
    console.log("ログインされてない");
    res.status(401).json({
      message: 'Please login.'
    });
  }
}, function (req, res) {
  console.log(req.body.username);
  Users.update(
    { username: req.body.username },
    { where: { id: req.user } }
  ).then(() => {
    req.user = req.body.username;
    res.status(200).json({
      message: 'changed username successfully'
    })
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.status(200).json({
    message: 'Logout successfully.'
  });
});

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.use((socket, next) => {
  session(socket.request, socket.request.res, next);
});

io.on('connection', socket => {
  const username = Users.findOne({
    attributes: [
      'username'
    ],
    where: {
      id: socket.request.session.passport.user
    }
  }).then(user => {
    const username = user.username;
    console.log(username);
    socket.on('chatMessage', msg => {
      console.log('message: ', msg);
      const msgobj = {
        username: username,
        message: msg,
        date: dt.toFormat("YYYY/MM/DD HH24:MI")
      };
      io.emit('chatMessage', msgobj);
    });
  });
});

server.listen(4001);
