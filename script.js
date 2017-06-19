var express = require("express");
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var app = express();
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.

//(Focus on This Variable)
var url = 'mongodb://localhost:27017/URLShortener';      
//(Focus on This Variable)

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// handle the url creation request
app.get("/new/*", function(req, res) {
  var query = req.url.slice(5, req.url.length+1);// get the content after /new/
  var reForHTTP = /^((http|https):\/\/)/i; // ignore cases in case some one use upper case letter
  var reForDot = /\./; // test for dot, I think I need to write the two regex as one, but
  //unfortunately I don't know how...
  var isURL = reForHTTP.test(query) && reForDot.test(query);
  if (isURL) {
    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log("Unable to connect to the mongoDB server. Error: " + err);
      } else {
        console.log("connected");
        
        db.collection("url").find({"original_url": query}).limit(1).count(function(err, num) {
          if (err) {
            console.log(err);
          }
          
          console.log(num);
          if (num > 0) {
            db.collection("url").find({"original_url": query}).toArray(function(err, docs) {
              docs.forEach(function(doc) {
                res.end(JSON.stringify(doc));
              })
            })
          }else {
            db.collection("url").count(function(err, num) {
              var id = num + 1;
              var shortURL = req.protocol + '://' + req.get('host') + "/" +id;
              var entry = {
                "original_url": query,
                "short_url": shortURL
              }
              db.collection("url").insertOne(entry, function(err, record) {
                res.end(JSON.stringify(entry));
              });
            })
          }
        }); // check to see if url alreay exist in the databse


      }
    })
  }else {
    res.end(JSON.stringify({
      error: "wrong URL format"
    }))
  }
});

app.get("*", function(req, res) {
  MongoClient.connect(url, function(err, db) {
    var query = Number.parseInt(req.url.slice(1, req.url.length+1));
    var shortURL = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (Number.isInteger(query)) {
      db.collection("url").find({"short_url": shortURL}).toArray(function(err, doc) {
        if (doc.length > 0) {
        var url = doc[0].original_url;
        res.redirect(url);         
        }else {
          res.end(JSON.stringify({
            "error": "NOT IN THE DATABASE"
          }));
        }

                       
      });
    }    
  })
  


  
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
});






// Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});