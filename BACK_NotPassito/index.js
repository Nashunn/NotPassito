//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();



//Create Connection
const conn = mysql.createConnection({
  host: 'sql2.freemysqlhosting.net',
  port: '3306',
  user: 'sql2309997',
  password: 'kK5%zP6!',
  database: 'sql2309997'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
//CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, x-access-token, Content-Type, authorization, Authorization, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});


//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM network";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    for (entry in results){
      complexity = computeComplexity(results[entry].passwd_value)
      results[entry].passwd_level = complexity
      console.log(results[entry]);
    }
    res.status(200).send({"result" : results});
  });
});

//route for insert data
app.post('/save',(req, res) => {
  let data = {passwd_name: req.body.passwd_name, passwd_user: req.body.passwd_user, passwd_value: req.body.passwd_value};
  let sql = "INSERT INTO network SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE network SET passwd_name='"+req.body.passwd_name+"', passwd_user='"+req.body.passwd_user+"', passwd_value='"+req.body.passwd_value+"' WHERE passwd_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM network WHERE passwd_id="+req.body.passwd_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});

/* var stringTest = "AdRoniS123!J3d^qQ";
console.log(computeComplexity(stringTest)) */

function computeComplexity(passwd){
  var nbLow = 0;
  var nbUpp = 0;
  var nbDig = 0;
  var nbSpec = 0;
  for (car in passwd){
    if (isLowerCase(passwd[car]))
      nbLow++;
    else if (isUpperCase(passwd[car]))
      nbUpp++;
    else if (!isNaN(passwd[car]))
      nbDig++;
    else
      nbSpec++;
  }
  complexity = anssiJudgment(nbLow, nbUpp, nbDig, nbSpec);
  return complexity;
}

function anssiJudgment(_nbLow, _nbUpp, _nbDig, _nbSpec){
  var length = _nbDig + _nbLow + _nbSpec + _nbUpp;
  if (length <= 9)
    return "baby"

  else if ( length > 9
            && length <= 15
            && _nbLow > 0
            && _nbUpp > 0
            && _nbDig > 0
            && _nbSpec > 0)
    return "child"

  else if ( length == 16
            && _nbLow == 0
            && _nbUpp > 0
            && _nbDig > 0
            && _nbSpec == 0)
    return "genins"

  else if ( length == 16
            && _nbLow > 0
            && _nbUpp > 0
            && _nbDig > 0
            && _nbSpec > 0)
    return "warrior"

  else if ( length > 16
      && _nbLow > 0
      && _nbUpp > 0
      && _nbDig > 0
      && _nbSpec > 0)
    return "God"

  else
    return "child"
}

function countLowerCase(passwd){
  var nb = 0;
  for (car in passwd){
    if (isLowerCase(passwd[car]))
      nb++;
    else
      continue;
  }
  return nb;
}

function countUpperCase(passwd){
  var nb = 0;
  //const isUpperCase = (string) => /^[A-Z]*$/.test(string)
  for (car in passwd){
    if (isUpperCase(passwd[car]))
      nb++;
    else
      continue;
  }
  return nb;
}

function countDigit(passwd){
  var nb = 0;
  for (car in passwd){
    if (!isNaN(passwd[car]))
      nb++;
    else
      continue;
  }
  return nb;
}

function countSpecial(passwd){
  var nb = 0;
  for (car in passwd){
    if (!isLowerCase(passwd[car]) && !isUpperCase(passwd[car]) && !isNaN(passwd[car]))
      nb++;
    else
      continue;
  }
  return nb;
}

function isUpperCase(str)
{
    return str != str.toLowerCase() && str == str.toUpperCase();
}

function isLowerCase(str)
{
    return str == str.toLowerCase() && str != str.toUpperCase();
}