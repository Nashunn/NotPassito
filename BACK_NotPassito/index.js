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
const cookieParser = require('cookie-parser')

var nbPasswd = 0;

//Create Connection
 const conn = mysql.createConnection({
  host: 'sql2.freemysqlhosting.net',
  port: '3306',
  user: 'sql2310777',
  password: 'uY3*aU8%',
  database: 'sql2310777'
});

/*const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Biow@Re22w!',
  database: 'notpassito'
});*/

//mysql -u sql2310777 -p'uY3*aU8%' -h sql2.freemysqlhosting.net -P 3306 -D sql2310777


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


//route for homepage
app.get('/', (req, res) => {
  res.render('login_view', {
    //results: results
  });
});

//route for homepage
app.get('/user/:user_id/:table_name/show', (req, res) => {
  var userId = req.url.split("/")[2];
  var tableName = req.url.split("/")[3];
  let sql = "SELECT p.* FROM password AS p \
            JOIN tablepassword AS tp on p.passwd_id = tp.passwd_id \
            JOIN base AS b on b.base_tableid = tp.table_id \
            JOIN user AS u on u.user_id = b.base_userid \
            WHERE u.user_id = "+ userId + " AND tp.table_name = '" + tableName + "'";
  console.log("Test SQL " + sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    for (entry in results) {
      complexity = computeComplexity(results[entry].passwd_value)
      results[entry].passwd_level = complexity
    }
    /*res.render('product_view', {
      results: results
    });*/
    res.send(results);
  });
});

app.get('/user/:user_id/nbPass', (req, res) => {
  var userId = req.url.split("/")[2];
  //let data = {passwd_name: req.body.passwd_name, passwd_user: req.body.passwd_user, passwd_value: req.body.passwd_value};
  let sql = "select count(p.passwd_id) as nb_pass \
  from password as p \
  join tablepassword as tp on p.passwd_id = tp.passwd_id \
  join base as b on b.base_tableid = tp.table_id \
  join user as u on u.user_id = b.base_userid \
  WHERE u.user_id ="+ userId;
  console.log("Test SQL " + sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get('/user/:user_id/nbTable', (req, res) => {
  var userId = req.url.split("/")[2];
  //let data = {passwd_name: req.body.passwd_name, passwd_user: req.body.passwd_user, passwd_value: req.body.passwd_value};
  let sql = "select count(distinct tp.table_id) as nb_table \
  from tablepassword as tp \
  join password as p on p.passwd_id = tp.passwd_id \
  join base as b on b.base_tableid = tp.table_id \
  join user as u on u.user_id = b.base_userid \
  WHERE u.user_id ="+ userId;
  console.log("Test SQL " + sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    console.log("Query : " + query);
    res.send(results);
  });
});

//route for connect to BDD
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
        console.log(results);
        /* res.render('product_view',{
          results: results
        }); */
        res.send(results);
      });
    }
  });
});

app.get('/registration', (req, res) => {
  res.render('inscription_view', {
    //results: results
  });
});

app.post('/inscription', (req, res) => {
  let data = { user_firstname: req.body.user_firstname, user_lastname: req.body.user_lastname, user_email: req.body.user_email, user_password: req.body.user_password };
  let sql = "INSERT INTO user SET ?"
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    else{
      console.log("OK 0");
      let sqlFindUser = "SELECT user_id from user where user_email = '"+data.user_email+"'";
      let query = conn.query(sqlFindUser, data, (err, results) => {
        if (err) throw err;
        else{
          data.userId = results[0].user_id;
          console.log("OK 1");
          let sqlInsertTestData = "INSERT INTO `password` (`passwd_name`, `passwd_user`, `passwd_value`) VALUES ('Test', 'UserTest', 'PasswordTest');";
          let query = conn.query(sqlInsertTestData, data, (err, results) => {
            if (err) throw err;
            else{
              console.log("OK 2");
              let sql_LastPasswd = "select passwd_id from password where passwd_id=(select max(passwd_id) from password)";
              let query = conn.query(sql_LastPasswd, data, (err, results) => {
                if (err) throw err;
                else{
                  console.log("OK 3");
                  data.passwdId = results[0].passwd_id;
                  let sql_LastTable = "select max(table_id) as table_id from tablepassword";
                  let query = conn.query(sql_LastTable, data, (err, results) => {
                    if (err) throw err;
                    else{
                      console.log("OK 4");
                      data.tableId = results[0].table_id + 1;
                      console.log(data);
                      let sql_InsertTable = "INSERT INTO `tablepassword` (`table_id`, `passwd_id`, `table_name`) \
                      VALUES ("+data.tableId+", "+data.userId+", 'tableTest')";
                      let query = conn.query(sql_InsertTable, data, (err, results) => {
                        if (err) throw err;
                        else{
                          let sql_LastBase = "select max(base_id) as base_id from base";
                          let query = conn.query(sql_LastBase, data, (err, results) => {
                            if (err) throw err;
                            else{
                              data.baseId = results[0].base_id + 1;
                              let sql_InsertInBase = "INSERT INTO `base` (`base_id`, `base_name`, `base_userid`, `base_tableid`) \
                              VALUES ("+data.baseId+", 'base_"+data.user_firstname+"', "+data.userId+", "+data.tableId+")";
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

app.post('/user/:user_id/createTable', (req, res) => {
  let data = { table_name: req.body.table_name};
  data.userId = req.url.split("/")[2];
  console.log("OK 0");
  console.log("OK 1");
    let sqlInsertTestData = "INSERT INTO `password` (`passwd_name`, `passwd_user`, `passwd_value`) VALUES ('Test', 'UserTest', 'PasswordTest');";
    let query = conn.query(sqlInsertTestData, data, (err, results) => {
      if (err) throw err;
      else{
        console.log("OK 2");
        let sql_LastPasswd = "select passwd_id from password where passwd_id=(select max(passwd_id) from password)";
        let query = conn.query(sql_LastPasswd, data, (err, results) => {
          if (err) throw err;
          else{
            console.log("OK 3");
            data.passwdId = results[0].passwd_id;
            let sql_LastTable = "select max(table_id) as table_id from tablepassword";
            let query = conn.query(sql_LastTable, data, (err, results) => {
              if (err) throw err;
              else{
                console.log("OK 4");
                data.tableId = results[0].table_id + 1;
                console.log(data);
                let sql_InsertTable = "INSERT INTO `tablepassword` (`table_id`, `passwd_id`, `table_name`) \
                VALUES ("+data.tableId+", "+data.passwdId+", '"+data.table_name+"')";
                let query = conn.query(sql_InsertTable, data, (err, results) => {
                  if (err) throw err;
                  else{
                    let sql_LastBase = "select max(b.base_id) as base_id,  b.base_name \
                    from base as b join user as u on u.user_id = base_userid \
                    where u.user_id ="+data.userId;
                    let query = conn.query(sql_LastBase, data, (err, results) => {
                      if (err) throw err;
                      else{
                        data.baseId = results[0].base_id + 1;
                        data.baseName = results[0].base_name;
                        let sql_InsertInBase = "INSERT INTO `base` (`base_id`, `base_name`, `base_userid`, `base_tableid`) \
                        VALUES ("+data.baseId+", '"+data.baseName+"', "+data.userId+", "+data.tableId+")";
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


//route for insert data
app.post('/user/:user_id/:table_name/save', (req, res) => {
  var userId = req.url.split("/")[2];
  var tableName = req.url.split("/")[3];
  var userUrlShow = "/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3] + "/show";

  let data = { passwd_name: req.body.passwd_name, passwd_user: req.body.passwd_user, passwd_value: req.body.passwd_value };

  // 1) Insert dans password
  let sql_InsertPasswd = "INSERT INTO password SET ?";
  let query_InsertPasswd = conn.query(sql_InsertPasswd, data,(err, results) => {
    if(err) throw err;
    else{
      // Dernier ID insert
      var idPassword = -1;
      let sql_LastPasswd = "select passwd_id from password where passwd_id=(select max(passwd_id) from password)";
      let query_LastPasswd = conn.query(sql_LastPasswd, (err, resultsLastID) => {
        if(err) throw err;
        else{
          data = {lastpasswdid: resultsLastID[0].passwd_id}
          data.userid = Number(userId);
          data.tablename = tableName;
          // 2) Récupérer l'id de la passwordtable
          let sql_FindTablePasswd = "select distinct tp.table_id \
          FROM tablepassword as tp \
          join base as b on b.base_tableid = tp.table_id \
          join user as u on u.user_id = b.base_userid \
          WHERE u.user_id ="+ userId +" \
          AND tp.table_name = '"+tableName+"'";
          let query_FindTablePasswd = conn.query(sql_FindTablePasswd, data,(err, resultsFindTable) => {
            if(err) throw err;
            else{
              console.log("Result fin tabl", resultsFindTable);
              data.tableid = resultsFindTable[0].table_id;
              //3 Créé une jointure entre password et table tablepassword
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

//route for update data
app.post('/user/:user_id/:table_name/update', (req, res) => {
  var userId = req.url.split("/")[2];
  var tableName = req.url.split("/")[3];
  var userUrlShow = "/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3] + "/show";

  let sql = "UPDATE password p \
  JOIN tablepassword tp on tp.passwd_id = p.passwd_id \
  JOIN base b on b.base_tableid = tp.table_id \
  JOIN user u on u.user_id = b.base_userid \
  SET passwd_name='"+ req.body.passwd_name + "', \
  passwd_user='"+ req.body.passwd_user + "', \
  passwd_value='"+ req.body.passwd_value + "'\
  WHERE u.user_id = " + userId + " AND tp.table_name = '" + tableName + "';"

  console.log(sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect(userUrlShow);
  });
});

//route for delete data
app.post('/user/:user_id/:table_name/delete', (req, res) => {
  var userId = req.url.split("/")[2];
  var tableName = req.url.split("/")[3];
  var userUrlShow = "/" + req.url.split("/")[1] + "/" + req.url.split("/")[2] + "/" + req.url.split("/")[3]+ "/show";
  let data = {passwd_id: Number(req.body.passwd_id)};
  // 1) Récupérer l'id associé à la table passwd à l'user et la bonne table
  // Requête : select table_id from tablepassword as tp join password as p on p.passwd_id = tp.passwd_id join base as b on b.base_tableid = tp.table_id join user as u on u.user_id = b.base_userid WHERE u.user_id = 1 AND tp.table_name = 'network' and p.passwd_id=3;
  let sqlGetID = "select table_id from tablepassword as tp \
  join password as p on p.passwd_id = tp.passwd_id \
  join base as b on b.base_tableid = tp.table_id \
  join user as u on u.user_id = b.base_userid \
  WHERE u.user_id = " + userId + " AND tp.table_name = '"+tableName+"' and p.passwd_id="+data.passwd_id;
  let queryGetID = conn.query(sqlGetID, data, (err, results) => {
    if(err) throw err;
    else{
      data.tableid = results[0].table_id;
      let sqlGetNbEntry = "select count(table_id) as nb_entry from tablepassword where table_id ="+data.tableid;
      let queryGetNbEntry = conn.query(sqlGetNbEntry, data, (err, results) => {
        if(err) throw err;
        else{
          data.nbentry = results[0].nb_entry;
          // Si c'est la dernière entrée pour cette table de password
          if (data.nbentry == 1){
            let sqlDelete = "DELETE FROM password WHERE passwd_id="+data.passwd_id;
            let query = conn.query(sqlDelete, (err, results) => {
              if(err) throw err;
              else{
                res.send(200);
              }
            });
          }
          // Sinon, il faudra recréer le lien entre user base et table supprimé par le delete on cascade
          else {
            console.log("DEBUG nb entry OK");
            let sql_FindTablePasswd = "SELECT b.* from base as b \
            JOIN tablepassword as tp on b.base_tableid = tp.table_id \
            JOIN user as u on u.user_id = b.base_userid \
            WHERE tp.passwd_id = "+data.passwd_id;
            let query_FindTablePasswd = conn.query(sql_FindTablePasswd, data,(err, resultsFindTable) => {
              if(err) throw err;
              else{
                console.log("DEBUG FindTablePasswd OK");
                data.base_id = resultsFindTable[0].base_id;
                data.base_name = resultsFindTable[0].base_name;
                data.base_userid = resultsFindTable[0].base_userid;
                data.base_tableid = resultsFindTable[0].base_tableid;
                console.log("Data :", data);
                let sqlDelete = "DELETE FROM password WHERE passwd_id="+data.passwd_id;
                let query = conn.query(sqlDelete, data, (err, results) => {
                  if(err) throw err;
                  else{
                    console.log("DEBUG Delete OK");
                    console.log("Data IN Delete :", data);
                    //3 Créé une jointure entre password et table tablepassword
                    let sqlAddJoin = "INSERT INTO `base` (`base_id`, `base_name`, `base_userid`, `base_tableid`) VALUES \
                    ("+data.base_id+", '"+data.base_name+"', "+data.base_userid+", + "+data.base_tableid+")";
                    let queryAddJoin = conn.query(sqlAddJoin, data, (err, results) => {
                      if(err) throw err;
                      else{
                        console.log("DEBUG Insert OK");
                        res.send(200);
                      }
                    });
                  }
                });
              }
            });
          }
        }
        //res.redirect(userUrlShow);
      });
    }
    //res.redirect(userUrlShow);
  });

  // 2) Récupérer le nombre d'entrée dans la table
  // Requête : select count(table_id) as nb_entry from tablepassword where table_id =1;

  // 2.1) Si le nombre est égal à 1 -> Simple lancé le delete
  // 2.2) Sinon, si le nombre est supérieur ->
  // Lancé le delete
  // Rajoute le lien dans la table base -> INSERT INTO `base` (`base_id`, `base_name`, `base_userid`, `base_tableid`) VALUES (1, 'base_adonis', 1, 1); 

  /* let sql = "DELETE FROM password WHERE passwd_id="+req.body.passwd_id;
  console.log("SQL : "+sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect(userUrlShow);
  }); */
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});

function getNumberPasswd(){
  let sql = "";
  var toto;
  conn.query("select count(passwd_id) as nb_passwd from password", (err, results) => {
    if(err) throw err;
    console.log("Result INSIDE :", results);
    // console.log("Query : ", query);
    toto = results;
    return toto;
  });
}

function computeComplexity(passwd) {
  var nbLow = 0;
  var nbUpp = 0;
  var nbDig = 0;
  var nbSpec = 0;
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
  complexity = anssiJudgment(nbLow, nbUpp, nbDig, nbSpec);
  return complexity;
}

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

function countLowerCase(passwd) {
  var nb = 0;
  for (car in passwd) {
    if (isLowerCase(passwd[car]))
      nb++;
    else
      continue;
  }
  return nb;
}

function countUpperCase(passwd) {
  var nb = 0;
  //const isUpperCase = (string) => /^[A-Z]*$/.test(string)
  for (car in passwd) {
    if (isUpperCase(passwd[car]))
      nb++;
    else
      continue;
  }
  return nb;
}

function countDigit(passwd) {
  var nb = 0;
  for (car in passwd) {
    if (!isNaN(passwd[car]))
      nb++;
    else
      continue;
  }
  return nb;
}

function countSpecial(passwd) {
  var nb = 0;
  for (car in passwd) {
    if (!isLowerCase(passwd[car]) && !isUpperCase(passwd[car]) && !isNaN(passwd[car]))
      nb++;
    else
      continue;
  }
  return nb;
}

function isUpperCase(str) {
  return str != str.toLowerCase() && str == str.toUpperCase();
}

function isLowerCase(str) {
  return str == str.toLowerCase() && str != str.toUpperCase();
}