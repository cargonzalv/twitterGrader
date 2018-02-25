var express = require('express');
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var googleAuth = require('google-auth-library');
var async = require('async');
var GoogleSpreadsheet = require('google-spreadsheet');

var router = express.Router();
var Twitter = require("twitter");
var R = require("request");



// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';





//variables de entorno de twitter
var key = process.env.TWITTER_CONSUMER_KEY;
var secret = process.env.TWITTER_CONSUMER_SECRET;
var cat = key +":"+secret;
var credentials = new Buffer(cat).toString('base64');
var url = 'https://api.twitter.com/oauth2/token';
//creación token de twitter
if(!process.env.TWITTER_BEARER_TOKEN){
  console.log("entro a no token");
  R({ url: url,
    method:'POST',
    headers: {
      "Authorization": "Basic " + credentials,
      "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: "grant_type=client_credentials"

  }, function(err, resp, body) {
    console.log(body);
  });
}



// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet('1QyzDkw0i2gNSTnL-_6cQhefA6u8kcfKDtFPLg37sWeo');
var sheet;
var col;
var row;
function grade(name,week,calification){
  async.series([
    function setAuth(step) {
      // see notes below for authentication instructions!
      var creds = require('../../client_secret_2.json');
      // OR, if you cannot save the file locally (like on heroku)
      var creds_json = {
        client_email: 'yourserviceaccountemailhere@google.com',
        private_key: 'your long private key stuff here'
      };

      doc.useServiceAccountAuth(creds, step);
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo(function(err, info) {
        sheet = info.worksheets.find((worksheet)=> worksheet.title == "Tweets Grades");
        step();
      });
    },
    function workingWithCells(step) {
      sheet.getCells({
        'min-row': 2,
        'max-row': 40,
        'return-empty': true
      }, function(err, cells) {
        cells.map((cell)=>{
          if((cell.row == 2 || cell.row == 3) && cell.value == week.replace("-","/")){
            col = cell.col;
          }
          if(cell.col == 7 && cell.value == name){
            row = cell.row;
          }
          if(cell.col == col && cell.row == row){
            console.log("col:"+cell.col + " row:" + cell.row);
            cell.value = calification;
            cell.save();
          }
        });

        step();
      });
    }
    ]);
  return {data:"bien"};
}


router.get("/rateTweet/:nombre",(req,res)=>{
  var resp = grade(req.params.nombre,req.query.semana,req.query.calificacion);
  return res.status(200).json(resp);
});
//devuelve los tweets de webdev
router.get("/getTweets", function(req, res){
  var client;
  if(process.env.TWITTER_BEARER_TOKEN){
    client = new Twitter({
      consumer_key: key,
      consumer_secret: secret,
      bearer_token: process.env.TWITTER_BEARER_TOKEN
    });
    var params = {q:"@uniandes #WebDev -filter:retweets",tweet_mode:"extended",until:req.query.date,count:40};
  }
  client.get("search/tweets", params, function(err, tweets, response){
    if(err || tweets==null){
      console.log("entro error de search")
    }
    return res.status(200).json(tweets);
  });
});

router.get('/', (req, res) => {
  res.send("hello");
});



module.exports = router;
