var express = require('express');
var pg = require('pg');

var router = express.Router();
var config = {
  database: 'deneb',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

router.get('/',function(req,res){
  pool.connect(function(errorConnectingToDB, db, done) {
    if(errorConnectingToDB){
        console.log('Only a flesh wound - error connecting to db', errorConnectingToDB);
        res.sendStatus(500);
    } else {
      var queryText = 'SELECT * FROM "koala";';
      db.query(queryText, function(errorMakingQuery, result){
        done();
        if(errorMakingQuery){
          console.log('I want to suck your blood - error making query', errorMakingQuery, result)
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});






module.exports = router;