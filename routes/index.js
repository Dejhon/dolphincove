var express = require('express');
const conn = require('../lib/db');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
        
          let sql ="SELECT * FROM amenities"
          conn.query(sql, (err, rows)=>{
            if(err) throw err
            res.render('index',{
                title: "Dolphin Cove",
                data:rows
            });
          });
       });
module.exports = router;