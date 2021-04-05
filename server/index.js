const express = require('express');
const ejs = require ('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

//Navigation
const clientPath = path.join(__dirname,'../client/');
const staticPath = path.join(clientPath, '/static/');
const viewsPath = path.join(clientPath, '/views/');

//Basic Server
const app = express();
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  name: 'anime',
  secret: 'eachcathad7kittens',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 1000*60*60*24*3,
  }
}));
app.listen(2000);

//Setting Views
app.set('view engine', 'ejs');
app.set('views', viewsPath);

//Visitor Counter
var x = 0;
const counter = function(req, res, next) {
  x++;
  console.log(x);
  next();
}

//Routes
app.get('/index', function(req, res) {
  //console.log(req.session);
  res.render('index', {data: req.session});
});

app.get('/about', function(req, res) {
  res.render('about', {data: req.session});
});

app.get('/contact', function(req, res) {
  res.render('contact', {data: req.session});
});

app.get('/gallery', function(req, res) {
  res.render('gallery', {data: req.session});
});

app.post('/welcome', (request, response) => {
  //console.log(request.body);
  request.session.username = request.body.nombre;
  response.send('SUCCESS');
});
