var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());

var path = require("path");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose_dashboard');


var CatSchema = new mongoose.Schema({
 name: String,
 weight: Number,
 type: String,
 created_at: {type: Date, default: Date.now}
})

mongoose.model('animal', CatSchema); // We are setting this Schema in our Models as 'User'
var Cat = mongoose.model('animal') // We are retrieving this Schema from our Models, named 'User'


// Setting our Static Folder Directory
app.use(express.static(__dirname + "./static"));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');


app.get('/cats/new', function(req, res) {

    res.render('new_cats');

})


app.get('/', function(req, res) {

  Cat.find({}, function(err, animals) {
      
      if(err){
        console.log("error");
      }
      else{
    res.render('index', {cats:animals});
  }
  })
})


app.get('/cat/remove/:id', function(req, res) {
 
  Cat.remove({_id: req.params.id}, function(err, cat){
    res.redirect('/')
  })
})


app.get('/edit/cat/:id', function(req, res) {
 
   Cat.findOne({_id: req.params.id}, function(err, cat){
    console.log(cat);
    res.render('edit_cat', {cat_info: cat})
  })

})


app.post('/update/cat/:id', function(req, res) {
 
  Cat.update({_id: req.params.id}, req.body, function(err, cat){
      
    res.redirect('/');
  })
})


app.get('/show/cat/:id', function(req, res) {
 
  Cat.findOne({_id: req.params.id}, function(err, cat){
    console.log(cat);
    res.render('show_cat', {cat_info: cat})
  })
})


app.post('/cats', function(req, res) {
 
  var cat = new Cat(req.body);
  
  cat.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      // console.log('successfully added a user!');
      res.redirect('/');
    }
  })
})


app.listen(8000, function() {
    console.log("listening on port 8000");
})