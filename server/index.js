//console.log('Hello!');
const express = require('express');
const ejs = require ('ejs');
const path = require('path');

const clientPath = path.join(__dirname,'../client');
const staticPath = path.join(clientPath, '/static');
const viewsPath = path.join(clientPath, '/views');

const app = express();

app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/contact', function(req, res) {
  res.render('contact');
});

app.get('/gallery', function(req, res) {
  res.render('gallery');
});

//adds middleware to the program
app.use(express.static(staticPath));

app.listen(2000);
