//use path module
const path = require('path');
//use cors
//var cors = require('cors')
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();
const cookieParser = require('cookie-parser')

//Create Connection with MySQL DB
 const conn = mysql.createConnection({
  host: 'sql2.freemysqlhosting.net',
  port: '3306',
  user: 'sql2311635',
  password: 'lJ6%pB3!',
  database: 'sql2311635'
});

//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

// cors
//app.use(cors())
//app.use(express.static(path.join(__dirname, 'dist/')))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, x-access-token, Content-Type, authorization, Authorization, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist/')))

//route for homepage
app.get('/', (req, res) => {
  res.render('login_view', {
    //results: results
  });
});


// connect one user
app.post('/connect',(req, res) => {
  let data = {user_email: req.body.user_email, user_password: req.body.user_password};
  let sql = "SELECT * FROM user WHERE user_email='"+req.body.user_email+"' AND user_password='"+req.body.user_password+"'";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    else if (results.length == 0){
      res.send(400);
    }
    else {
      var userId = results[0].user_id;
      let sql_tableUser = "SELECT DISTINCT \
      u.user_id, u.user_firstname, u.user_lastname, u.user_email, u.user_password,tp.table_name \
      FROM tablepassword AS tp \
      JOIN base AS b on b.base_tableid = tp.table_id \
      JOIN user AS u ON u.user_id = b.base_userid \
      WHERE u.user_id ="+userId;
      let query = conn.query(sql_tableUser, data,(err, results) => {
        res.send(results);
      });
    }
  });
});


// show table of user by id and table name
app.get('/user/:user_id/:table_name/show', (req, res) => {
  var userId = req.url.split("/")[2];
  var tableName = req.url.split("/")[3];
  let sql = "SELECT p.* FROM password AS p \
            JOIN tablepassword AS tp on p.passwd_id = tp.passwd_id \
            JOIN base AS b on b.base_tableid = tp.table_id \
            JOIN user AS u on u.user_id = b.base_userid \
            WHERE u.user_id = "+ userId + " AND tp.table_name = '" + tableName + "'";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    for (entry in results) {
      complexity = computeComplexity(results[entry].passwd_value)
      results[entry].passwd_level = complexity
    }
    res.send(results);
  });
});

// Get number of password for one user
app.get('/user/:user_id/nbPass', (req, res) => {
  var userId = req.url.split("/")[2];
  let sql = "select count(p.passwd_id) as nb_pass \
  from password as p \
  join tablepassword as tp on p.passwd_id = tp.passwd_id \
  join base as b on b.base_tableid = tp.table_id \
  join user as u on u.user_id = b.base_userid \
  WHERE u.user_id ="+ userId;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Get number of password table for one user
app.get('/user/:user_id/nbTable', (req, res) => {
  var userId = req.url.split("/")[2];
  let sql = "select count(distinct tp.table_id) as nb_table \
  from tablepassword as tp \
  join password as p on p.passwd_id = tp.passwd_id \
  join base as b on b.base_tableid = tp.table_id \
  join user as u on u.user_id = b.base_userid \
  WHERE u.user_id ="+ userId;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Send inscription view
app.get('/registration', (req, res) => {
  res.render('inscription_view', {
    //results: results
  });
});

// Add one user in base and create a table password and a password test.
app.post('/inscription', (req, res) => {
  let data = { user_firstname: req.body.user_firstname, user_lastname: req.body.user_lastname, user_email: req.body.user_email, user_password: req.body.user_password };
  let sql = "INSERT INTO user SET ?"
  // 1) Create a user in base
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    else{
      // 2) Get User ID create by system just before
      let sqlFindUser = "SELECT user_id from user where user_email = '"+data.user_email+"'";
      let query = conn.query(sqlFindUser, data, (err, results) => {
        if (err) throw err;
        else{
          data.userId = results[0].user_id;
          // 3) Create a test password
          let sqlInsertTestData = "INSERT INTO `password` (`passwd_name`, `passwd_user`, `passwd_value`) VALUES ('Test', 'UserTest', 'PasswordTest');";
          let query = conn.query(sqlInsertTestData, data, (err, results) => {
            if (err) throw err;
            else{
              // 4) Find last password id created by system
              let sql_LastPasswd = "select passwd_id from password where passwd_id=(select max(passwd_id) from password)";
              let query = conn.query(sql_LastPasswd, data, (err, results) => {
                if (err) throw err;
                else{
                  data.passwdId = results[0].passwd_id;
                  let sql_LastTable = "select max(table_id) as table_id from tablepassword";
                  // 5) Find last table password id created by system
                  let query = conn.query(sql_LastTable, data, (err, results) => {
                    if (err) throw err;
                    else{
                      data.tableId = results[0].table_id + 1;
                      let sql_InsertTable = "INSERT INTO `tablepassword` (`table_id`, `passwd_id`, `table_name`) \
                      VALUES ("+data.tableId+", "+data.userId+", 'tableTest')";
                      // 6) Link previous password created to new table password called tableTest
                      let query = conn.query(sql_InsertTable, data, (err, results) => {
                        if (err) throw err;
                        else{
                          let sql_LastBase = "select max(base_id) as base_id from base";
                          // 7) Find last base ID for table "base" and add 1 for next insert 
                          let query = conn.query(sql_LastBase, data, (err, results) => {
                            if (err) throw err;
                            else{
                              data.baseId = results[0].base_id + 1;
                              let sql_InsertInBase = "INSERT INTO `base` (`base_id`, `base_name`, `base_userid`, `base_tableid`) \
                              VALUES ("+data.baseId+", 'base_"+data.user_firstname+"', "+data.userId+", "+data.tableId+")";
                              // 8) Link last table password on base from last user created
                              let query = conn.query(sql_InsertInBase, data, (err, results) => {
                                if (err) throw err;
                                else{
                                  res.send(200);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

// Create a password table from one user and add one password test inside
app.post('/user/:user_id/createTable', (req, res) => {
  let data = { table_name: req.body.table_name};
  data.userId = req.url.split("/")[2];
    let sqlInsertTestData = "INSERT INTO `password` (`passwd_name`, `passwd_user`, `passwd_value`) VALUES ('Test', 'UserTest', 'PasswordTest');";
    // 1) Create a test password
    let query = conn.query(sqlInsertTestData, data, (err, results) => {
      if (err) throw err;
      else{
        let sql_LastPasswd = "select passwd_id from password where passwd_id=(select max(passwd_id) from password)";
        // 2) Find last password id created by system
        let query = conn.query(sql_LastPasswd, data, (err, results) => {
          if (err) throw err;
          else{
            data.passwdId = results[0].passwd_id;
            let sql_LastTable = "select max(table_id) as table_id from tablepassword";
            // 3) Find last table password id created by system
            let query = conn.query(sql_LastTable, data, (err, results) => {
              if (err) throw err;
              else{
                data.tableId = results[0].table_id + 1;
                let sql_InsertTable = "INSERT INTO `tablepassword` (`table_id`, `passwd_id`, `table_name`) \
                VALUES ("+data.tableId+", "+data.passwdId+", '"+data.table_name+"')";
                // 4) Link previous password created to new table password with a name given by user
                let query = conn.query(sql_InsertTable, data, (err, results) => {
                  if (err) throw err;
                  else{
                    let sql_LastBase = "select max(b.base_id) as base_id,  b.base_name \
                    from base as b join user as u on u.user_id = base_userid \
                    where u.user_id ="+data.userId;
                    // 5) Find base ID for current user
                    let query = conn.query(sql_LastBase, data, (err, results) => {
                      if (err) throw err;
                      else{
                        data.baseId = results[0].base_id + 1;
                        data.baseName = results[0].base_name;
                        let sql_InsertInBase = "INSERT INTO `base` (`base_id`, `base_name`, `base_userid`, `base_tableid`) \
                        VALUES ("+data.baseId+", '"+data.baseName+"', "+data.userId+", "+data.tableId+")";
                        // 6) Link last table password created on base from current user
                        let query = conn.query(sql_InsertInBase, data, (err, results) => {
                          if (err) throw err;
                          else{
                            res.send(200);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
});


//route for insert data into a password table
app.post('/user/:user_id/:table_name/save', (req, res) => {
  var userId = req.url.split("/")[2];
  var tableName = req.url.split("/")[3];
  var userUrlShow = "/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3] + "/show";

  let data = { passwd_name: req.body.passwd_name, passwd_user: req.body.passwd_user, passwd_value: req.body.passwd_value };

  // 1) Insert into password
  let sql_InsertPasswd = "INSERT INTO password SET ?";
  let query_InsertPasswd = conn.query(sql_InsertPasswd, data,(err, results) => {
    if(err) throw err;
    else{
      // Get last ID created by system
      var idPassword = -1;
      let sql_LastPasswd = "select passwd_id from password where passwd_id=(select max(passwd_id) from password)";
      let query_LastPasswd = conn.query(sql_LastPasswd, (err, resultsLastID) => {
        if(err) throw err;
        else{
          data = {lastpasswdid: resultsLastID[0].passwd_id}
          data.userid = Number(userId);
          data.tablename = tableName;
          // 2) Get id of passwordtable for one user id and one table name
          let sql_FindTablePasswd = "select distinct tp.table_id \
          FROM tablepassword as tp \
          join base as b on b.base_tableid = tp.table_id \
          join user as u on u.user_id = b.base_userid \
          WHERE u.user_id ="+ userId +" \
          AND tp.table_name = '"+tableName+"'";
          let query_FindTablePasswd = conn.query(sql_FindTablePasswd, data,(err, resultsFindTable) => {
            if(err) throw err;
            else{
              data.tableid = resultsFindTable[0].table_id;
              // 3) Add a link between password and table password
              let sqlAddJoin = "INSERT INTO `tablepassword` (`table_id`, `passwd_id`, `table_name`) VALUES \
              ("+data.tableid+", "+data.lastpasswdid+", '"+data.tablename+"')";
              let queryAddJoin = conn.query(sqlAddJoin, data, (err, results) => {
                if(err) throw err;
                else{
                  res.send(200);
                }
              });
            }
          });
        }
      });
    }
  });

});

// route for update one password
app.post('/user/:user_id/:table_name/update', (req, res) => {
  var userId = req.url.split("/")[2];
  var tableName = req.url.split("/")[3];
  var userUrlShow = "/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3] + "/show";

  let sql = "UPDATE password p \
  SET passwd_name='"+ req.body.passwd_name + "', \
  passwd_user='"+ req.body.passwd_user + "', \
  passwd_value='"+ req.body.passwd_value + "'\
  WHERE p.passwd_id = " + req.body.passwd_id;

  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect(userUrlShow);
  });
});

// route for delete one password
app.post('/user/:user_id/:table_name/delete', (req, res) => {
  var userId = req.url.split("/")[2];
  var tableName = req.url.split("/")[3];
  var userUrlShow = "/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3]+ "/show";
  let data = {passwd_id: Number(req.body.passwd_id)};
  // 1) Get table id for this password
  let sqlGetID = "select table_id from tablepassword as tp \
  join password as p on p.passwd_id = tp.passwd_id \
  join base as b on b.base_tableid = tp.table_id \
  join user as u on u.user_id = b.base_userid \
  WHERE u.user_id = " + userId + " AND tp.table_name = '"+tableName+"' and p.passwd_id="+data.passwd_id;
  let queryGetID = conn.query(sqlGetID, data, (err, results) => {
    if(err) throw err;
    else{
      data.tableid = results[0].table_id;
      // 2) Get number of link to determine if those delete is the last
      // or if there is other password in this table password
      let sqlGetNbEntry = "select count(table_id) as nb_entry from tablepassword where table_id ="+data.tableid;
      let queryGetNbEntry = conn.query(sqlGetNbEntry, data, (err, results) => {
        if(err) throw err;
        else{
          data.nbentry = results[0].nb_entry;
          // If this is the last delete, delete the password table too
          if (data.nbentry == 1){
            let sqlDelete = "DELETE FROM password WHERE passwd_id="+data.passwd_id;
            let query = conn.query(sqlDelete, (err, results) => {
              if(err) throw err;
              else{
                res.return(200);
              }
            });
          }
          // Delete password and recreate link between table password and password table
          else {
            let sql_FindTablePasswd = "SELECT b.* from base as b \
            JOIN tablepassword as tp on b.base_tableid = tp.table_id \
            JOIN user as u on u.user_id = b.base_userid \
            WHERE tp.passwd_id = "+data.passwd_id;
            // 1) Get associated table ID
            let query_FindTablePasswd = conn.query(sql_FindTablePasswd, data,(err, resultsFindTable) => {
              if(err) throw err;
              else{
                data.base_id = resultsFindTable[0].base_id;
                data.base_name = resultsFindTable[0].base_name;
                data.base_userid = resultsFindTable[0].base_userid;
                data.base_tableid = resultsFindTable[0].base_tableid;
                // 2) Delete password (and password table because of DELETE ON CASCADE)
                let sqlDelete = "DELETE FROM password WHERE passwd_id="+data.passwd_id;
                let query = conn.query(sqlDelete, data, (err, results) => {
                  if(err) throw err;
                  else{
                    // 3) Recreate link between password and table password
                    let sqlAddJoin = "INSERT INTO `base` (`base_id`, `base_name`, `base_userid`, `base_tableid`) VALUES \
                    ("+data.base_id+", '"+data.base_name+"', "+data.base_userid+", + "+data.base_tableid+")";
                    let queryAddJoin = conn.query(sqlAddJoin, data, (err, results) => {
                      if(err) throw err;
                      else{
                        res.send(200);
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  });
});

// server listening
var port=4000;
app.listen(port, () => {
  console.log('Server is running at port ', port);
});

// Function to compute complexity of one password
function computeComplexity(passwd) {
  var nbLow = 0;
  var nbUpp = 0;
  var nbDig = 0;
  var nbSpec = 0;
  // Loop to describe password
  for (car in passwd) {
    if (isLowerCase(passwd[car]))
      nbLow++;
    else if (isUpperCase(passwd[car]))
      nbUpp++;
    else if (!isNaN(passwd[car]))
      nbDig++;
    else
      nbSpec++;
  }
  // Calcul complexity from anssi recommendation
  complexity = anssiJudgment(nbLow, nbUpp, nbDig, nbSpec);
  return complexity;
}

// This function just return one funny key word from ANSSI password recommendation
// Found here : http://www.ssi.gouv.fr/administration/precautions-elementaires/calculer-la-force-dun-mot-de-passe/ 
function anssiJudgment(_nbLow, _nbUpp, _nbDig, _nbSpec) {
  var length = _nbDig + _nbLow + _nbSpec + _nbUpp;
  if (length <= 9)
    return "baby"

  else if (length > 9
    && length <= 15
    && _nbLow > 0
    && _nbUpp > 0
    && _nbDig > 0
    && _nbSpec > 0)
    return "child"

  else if (length == 16
    && _nbLow == 0
    && _nbUpp > 0
    && _nbDig > 0
    && _nbSpec == 0)
    return "genins"

  else if (length == 16
    && _nbLow > 0
    && _nbUpp > 0
    && _nbDig > 0
    && _nbSpec > 0)
    return "warrior"

  else if (length > 16
    && _nbLow > 0
    && _nbUpp > 0
    && _nbDig > 0
    && _nbSpec > 0)
    return "God"

  else
    return "child"
}

function isUpperCase(str) {
  return str != str.toLowerCase() && str == str.toUpperCase();
}

function isLowerCase(str) {
  return str == str.toLowerCase() && str != str.toUpperCase();
}