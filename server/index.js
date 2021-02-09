//console.log('Hello!');
const express = require('express');
const ejs = require ('ejs');
const path = require('path');

const clientPath = path.join(__dirname,'../client/');
const staticPath = path.join(clientPath, '/static/');
const viewsPath = path.join(clientPath, '/views/');

const app = express();

app.set('view engine', 'ejs');
app.set('views', viewsPath);

var x = 0;

const counter = function(req, res, next) {
  x++;
  console.log(x);
  next();
}

app.use(counter);

app.use(express.static(staticPath));

app.get('/', function(req, res) {
  res.render('index');
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


app.listen(2000);
