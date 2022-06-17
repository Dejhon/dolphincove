var express = require('express');
const flash = require('express-flash');
const res = require('express/lib/response');
const conn = require('../lib/db');
var router = express.Router();

router.get('/', (req, res)=>{
    res.render('signup',{
        message: req.flash('Message'),
        title: "Signup Form"
    });
});

router.post('/register', (req, res)=>{
    let data = {
               name: req.body.name,
               email: req.body.mail,
               password: req.body.password
               }
    let udata = {
                 user_type_id: 2,
                 user_nm: req.body.name,
                 password: req.body.password
                }
    let sql = "INSERT INTO buscompany SET ?"
    let uSql = "INSERT INTO users SET ?"

    conn.query(sql, data, (err, rows)=>{
        if(err) throw err
        conn.query(uSql, udata,(err, rows)=>{
            if(err) throw err
            req.flash('Message', "Signup Successful")
            res.redirect('/form')
        });
    });
});

module.exports = router