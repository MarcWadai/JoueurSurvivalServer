var fs = require("fs");
var file = "/home/marcwaka/Documents/server/test.db";
var exists = fs.existsSync(file);
var bodyParser =require('body-parser');
var jsonArr = [];

var express = require('express');
var restapi = express();
restapi.use(bodyParser.urlencoded({extended:true}));

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}


db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE highscore (player TEXT, score INT)");
  }
  
        var stmt = db.prepare("INSERT INTO highscore VALUES (?,?)");
  
//Insert random data
  var rnd;
var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++) {
var text;
  text = possible.charAt(Math.floor(Math.random() * possible.length));
  text += possible.charAt(Math.floor(Math.random() * possible.length));
    rnd = Math.floor(Math.random() * 10);
    stmt.run(text, rnd);
  }
  
stmt.finalize();

  db.each("SELECT player AS id, score AS thing FROM highscore", function(err, row) {
    console.log(row.id + ": " + row.thing);
    jsonArr.push({player: row.id, score: row.thing});
  });
});




restapi.get('/data', function(req, res){
	res.json(jsonArr);
});

restapi.post('/data/newScore', function(req, res){
	var playerParam = req.body.player;
	var scoreParam = req.body.score;
	if (typeof playerParam !== 'undefined' && playerParam !== null && typeof scoreParam !== 'undefined' && scoreParam !== null){
		res.send(playerParam +" : "+ scoreParam);  
	}
	db.serialize(function() {
		var insertData = db.prepare("INSERT INTO highscore VALUES(?,?)");
		insertData.run(playerParam, scoreParam);
		insertData.finalize();		
	});

});


restapi.listen(3000);
console.log("Hello to your local game server at port 3000");



