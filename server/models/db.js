"use strict";
var mongo = require("mongodb").MongoClient;
var config= require("./dbconfig.js");

var state = {
  conn:null
};

exports.connect = function(done){
  if (state.conn) return done();
  mongo.connect(config.url, function(err, db) {
    if (err) return done(err);
    state.conn = db;
    done();
  });
};

exports.get = function(){
  return state.conn;
};

exports.close = function(done){
  if(state.conn){
    state.conn.close(function(err, result){
      state.conn = null;
      state.mode = null;
      done();
    });
  }
};

