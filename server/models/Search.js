var db = require("./db.js"),
  ObjectId = require("mongodb").ObjectID;

/*
Search represents the database methods for accesing the users collections.
{
  _id,
  name,
  email,
  password,
  bio,
  clubs: [clubs: ObjectID],
  messages: [mesages]
}
*/

/*
Object that represents the messages in a group or club board
{
  sender_name,
  sender: user:ObjectID,
  text,
  timestamp: Date (Decided at server side)
}
*/

var Search = {};

Search.findById = function(id_search, callback){
  var searches = db.get().collection("searches");
  searches.findOne({login:id_search}, function(err, user){
    callback(err, user);
  });
};

Search.create = function(search, callback){
  var searches = db.get().collection("searches");
  searches.insertOne(search, function(err, insertedDocs){
    callback(err, insertedDocs);
  });
};


module.exports = Search;

