//jshint esversion:6
//requiring 4 modules that we install in hyper terminal earlier
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();// creating new app instant using Express

app.set('view engine', 'ejs');//we set our view engine to use ejs our templating engine

app.use(bodyParser.urlencoded({//using body parser(postman) in order to pass our requests
  extended: true
}));
app.use(express.static("public"));//use public directory to store our static files such as images & css code
//to set up mongodb we use mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});//this line allow mongoose to connect to our MongoDB instance
//create schema
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);//creating Articlemodel using mongoose

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/articles")//in here we specify the route that we want all our get post put delete to target
//creating app get route that fetches all articles
.get(function(req, res){
  Article.find(function(err, foundArticles){// Article is the model where we are going to quesry all documnets inside articles collection
    if (!err) {
      res.send(foundArticles);//if no errors then result will be sending all foundArticles
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){//specifying the route when user post new thing

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){//specifying the route when user want to delete

  Article.deleteMany(function(err){//mongoose method
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/:articleTitle")//user should specify the particular rsource(articleTitle) they want

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){//findOne method used bcz here user wants to look for only one
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){//for updating title & content

  Article.update(//mongoose method
    {title: req.params.articleTitle},//first search articleTitle for updating
    {title: req.body.title, content: req.body.content},//here body-parser passing our request & looking for that thing that's sent over through an html form
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
});

app.patch(function(req, res){ //when user wants to update just one particular field

  Article.update(
    {title: req.params.articleTitle},//search by articleTitle

    {$set: req.body},//MongoDB method.. when we let the user choose what he wants to update either title or content so now when use sends over patch req then body-parser will repass the request & pick out the fields thet user provided updates to which has a new value
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},//title should be matched with articleTitle
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {// sets up this app to listen on port 3000
  console.log("Server started on port 3000");
});
