const express = require('express');
const ejs = require ('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const {BlogPost} = require('./models.js')

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
mongoose.connect('mongodb://localhost:27017/anime', {useNewUrlParser: true});
app.listen(2000);

//Setting Views
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use((req, res, next)=>{
    console.log(req.originalUrl);
    next();
})

//Visitor Counter
var x = 0;
const counter = function(req, res, next) {
  x++;
  console.log(x);
  next();
}

//Routes
app.get('/', function(req, res) {
  console.log(req.session);
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

app.get('/blog/', async (req, res) => {
  var posts = await BlogPost.find({}, (error, result) => {
    if(error) {
      console.log(error);
      res.sendStatus(500);
    }
    console.log(result);
    res.render('blog', {data: req.session, postset: result});
  });
});

app.get('/blog/write/', (req, res) => {
  res.render('writing', {data: req.session, draft: {}});
});

app.get('/blog/:id/', async (req, res)=>{
  var searchID = req.params.id; //adds whatever id as a parameter in the url /blog/:id
  BlogPost.findById(searchID, (error, result)=>{ //searches blogpost collection by id
    if(error) {
      console.log(error);
      res.redirect('/blog/');
    }
    else if(!result) {
      res.status(404);
    }
    else {
      res.render('entry', {data: req.session, entry: result})
    }
  });
});

app.post('/blog/writepost', async (req, res) => {
  console.log(req.body);
  try {
    let newPost = new BlogPost(req.body);
    await newPost.save();
    res.redirect('/blog/');
  }
  catch(e) {
    res.redirect('/blog/write/');
  }
});

// app.post('/writepost', (request, response) => {
//   console.log(request.body);
//   response.redirect('/index');
// });

app.post('/welcome', (request, response) => {
  request.session.username = request.body.nombre;
  response.send('SUCCESS');
});

app.get('/blog/:id/edit', (req, res) =>{
  BlogPost.findById(req.params.id, (error, result)=>{
    if(error) res.redirect('/blog/');
    else if(!result) res.redirect('/blog/');
    else res.render('writing', {data: req.session, draft: result});
  });
});

app.post('/blog/:id/edit', (req, res) =>{
  BlogPost.findById(req.params.id, (error, result)=>{
    if(error) {
      console.log(error);
      res.status(500);
    }
    else if(result) {
      result.title = req.body.title;
      result.body = req.body.body;
      result.save();
      res.redirect(path.join('/blog/', req.params.id));
    }
    else res.render('/blog/');
  });
});

// app.put('/blog/:id/update', (req, res)=>{
//   console.log(req);
//   res.redirect('/blog/');
// });

app.get('/blog/:id/delete', (req, res)=>{
  BlogPost.deleteOne({_id: req.params.id}, (error, result)=>{
    if(error){
      console.log(error);
    }
    res.redirect('/blog/');
  });
});
