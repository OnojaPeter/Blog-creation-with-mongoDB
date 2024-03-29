//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = [];
console.log(`Secret Key: ${secretKey}`);
//-------------------mongoose connect----------------------
mongoose.connect(`mongodb+srv://${secretKey}@cluster0.k6f3v2f.mongodb.net/blogDB`, {
  useNewUrlParser: true,       
  useUnifiedTopology: true    
});

const pageSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Page = mongoose.model("Page", pageSchema);

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);



// const page1 = new Page({
//   title: "home",
//   content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
// });
// page1.save();
// const page2 = new Page({
//   title: "about",
//   content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
// })
// page2.save();
// const page3 = new Page({
//   title: "contact",
//   content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.",
//   });
//   page3.save();



//-------------------mongoose connect----------------------

app.get("/",async function(req, res){
  try{
    const blogs = await Page.findById("651e71c416f8bbea2ce4cc6f");
    const foundItems  = await Post.find({});
    res.render("home", {
      startingContent: blogs.content,
      posts: foundItems,  
      });
  } catch(err){
    console.error(err); 
  }
});

app.get("/about",async function(req, res){
  try{
    const blogs = await Page.findById("651e71c416f8bbea2ce4cc70");
    res.render("about", {aboutContent: blogs.content});
  } catch(err){
    console.error(err); 
  }
});

app.get("/contact",async function(req, res){
  try{
    const blogs = await Page.findById("651e71c416f8bbea2ce4cc71"); 
    res.render("contact", {contactContent: blogs.content});
  } catch(err){
    console.error(err); 
  }
});

app.get("/compose",async function(req, res){
  try{
    
    res.render("compose");
  } catch(err){
    console.error(err);
  }
  
});

app.post("/compose",async function(req, res){
  try{
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });

    post.save();

    res.redirect("/");
  } catch(err){
    console.error(err);
  }

  

});

app.get("/posts/:postId",async function(req, res){
  try{
    const requestedPostId = req.params.postId;
     // Find the post by _id
    const post = await Post.findOne({
      _id: requestedPostId,
    });

    if (post) {
      // If the post is found, render it
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    } else {
      // If the post is not found, handle the case here (e.g., render an error page)
      res.status(404).render("not-found", {
        errorMessage: "Post not found",
      });
    }
  } catch(err) {
    console.error(err);
    // Handle any other errors here
    res.status(500).send("Internal Server Error");
  }
  

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
