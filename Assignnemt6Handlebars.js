var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var credentials = require('./credentials.js');
var request = require('request');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3131);


var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_cairnsi',
  password        : credentials.databasePWD,
  database        : 'cs290_cairnsi'
});


app.get('/',function(req,res){
  var context = {};
   res.render('home',context);
});

app.get('/table', function(req,res){
	pool.query("Select * FROM workouts", function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
});


//`name`,`reps`,`weight`,`date`,`lbs`
//req.body.name,req.body.reps,req.body.weight,req.body.date,req.body.units
app.post('/tableInsert',function(req,res,next){
	pool.query("INSERT INTO workouts (`name`,`reps`) VALUES (?)", [req.body.name,req.body.reps], function(err, result){
		if(err){
			next(err);
			return;
		}else{
			var data={};
			res.json(JSON.stringify(result));
		}
	});
	
});

app.get('/tableReset',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    if(!err){
		var createString = "CREATE TABLE workouts("+
		"id INT PRIMARY KEY AUTO_INCREMENT,"+
		"name VARCHAR(255) NOT NULL,"+
		"reps INT,"+
		"weight INT,"+
		"date VARCHAR(255),"+
		"lbs VARCHAR(255))";
		pool.query(createString, function(err){
			if(!err){
				var data={};
				data.result = "Table reset";
				res.json(JSON.stringify(data));
			}else{
				next(err);
			}
		});
	}else{
		next(err);
	}
  });
});

app.post('/', function(req,res,next){
  
  
  
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
