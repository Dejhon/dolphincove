var mysql = require('mysql');
var conn = mysql.createConnection({
    host: "localhost",   
    user: "root",    
    password: "root",   
    database: "dolphincove"
  });

  conn.connect((err)=> {
    if(!err)
        console.log('Successfully Connected to Dolphin Cove Database');
    else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });
    
module.exports = conn;