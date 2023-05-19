const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

require('dotenv').config({path: __dirname + '/.env'});



// setting up EJS and Express
const app = express();
app.set('view engine','ejs');
app.use(express.static('public'));


// This is required to use the bodyParser for HTML sites
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup, for testing I have 1 DB name with different collections.
dbName = 'wikiDB'
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const uri = "mongodb+srv://"+dbUser+":"+dbPassword+"@learningcluster.eufjoqu.mongodb.net/"+dbName+"?retryWrites=true&w=majority"

const client = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    w: 'majority',
    wtimeoutMS: 10000,
    retryWrites: true,
};


// setting up mongoose connection for online connection
// mongoose.connect(uri,client)
//   .then(() => {
//     console.log("mongoDB connected successfully");
//   })
//   .catch((err) => {
//     console.log("Error while connecting", err);
//   })

mongoose.connect("mongodb://127.0.0.1:27017/"+dbName,{useNewUrlParser: true})
  .then(() => {
    console.log("mongoDB Test connected successfully");
  })
  .catch((err) => {
    console.log("Error while connecting", err);
  })


//dbSchema
const articleSchema = ({
    title:String,
    content:String
});

const Article = mongoose.model("Article", articleSchema);

async function createEntry(title,content){
    const article = Article({
        title:title,
        content:content
    });
    await article.save();
    console.log("Article saved")
};

async function getAllEntries(){
    try {
        const articlePost = await Article.find();
        return articlePost;
    } catch (err) {
        console.log("There was an error: " + err);
        throw err;
    }
    
}



app.get("/", async function(req,res){
    try{
        const articlePost = await getAllEntries();
        res.render("home",{articlePost:articlePost});
    } catch (err) {
        console.log("There was an error .get()"+ err)
        // [TODO] add error page
    }
    
})

app.get("/create", function(req,res){
    res.render("create");
})


//Setting up app listener
  app.listen(3000, function(){
    console.log("Server is running.");
});
