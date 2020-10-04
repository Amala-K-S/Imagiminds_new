const mongo = require('mongodb');
const uri = "mongodb+srv://admin-amala:Smash1551@cluster0.yzaqe.mongodb.net/Imagiminds?retryWrites=true&w=majority";

var db;
var error;
var waiting = []; 

mongo.MongoClient.connect(URL,{useUnifiedTopology:true},function(err,client)
{
  error = err;
  db = client;
  console.log("connected");
  waiting.forEach(function(callback) {
    callback(err, db);
  });
});

module.exports = function conn(callback) {
  if (db || error) {
    callback(error, db);
  } else {
    waiting.push(callback);
  }
}