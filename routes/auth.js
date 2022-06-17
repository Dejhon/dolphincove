var express = require('express');
const flash = require('express-flash');
const res = require('express/lib/response');
const conn = require('../lib/db');
var router = express.Router();

router.get('/', (req, res)=>{
    res.render('login',{
        message: req.flash('Message'),
        title: "Login"
    });
});

router.post('/login', (req, res)=>{
    username = req.body.name
    password = req.body.password
    conn.query("SELECT user_type_id AS type, user_nm AS user, password AS Secret FROM users WHERE BINARY user_nm = ? AND BINARY password = ?", [username, password], (err, rows)=>{
        if(err) throw err
        if(rows.length <= 0){
            req.flash('Message', "Invalid Credentials")
            res.redirect('/login')
        }else if(rows[0].type == 1){
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/admin');           
        }else if(rows[0].type == 2){
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/company');
        };        
    });
});

router.get('/logout', function (req, res) {
    req.session.destroy(()=>{
        res.redirect('/login')
    });
 });

module.exports = router