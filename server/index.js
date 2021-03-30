const express = require('express');
const ejs = require ('ejs');
const path = require('path');
const bodyParser = require('body-parser');

//Navigation
const clientPath = path.join(__dirname,'../client/');
const staticPath = path.join(clientPath, '/static/');
const viewsPath = path.join(clientPath, '/views/');

//Basic Server
const app = express();
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({extended: true}));
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
var userName = '';

app.get('/index', function(req, res) {
  res.render('index', {nomen: userName});
});

app.get('/about', counter, function(req, res) {
  res.render('about',{count: x});
});

app.get('/contact', function(req, res) {
  res.render('contact');
});

app.get('/gallery', function(req, res) {
  res.render('gallery');
});

app.post('/welcome', (request, response) => {
  console.log(request.body.visitorname);
  userName = request.body.visitorname;
  response.redirect('/index');
});
