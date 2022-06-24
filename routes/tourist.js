var express = require('express');
const flash = require('express-flash');
const res = require('express/lib/response');
const conn = require('../lib/db');
var router = express.Router();


router.get('/voucher', (req, res)=>{
    res.render('myreservation')
})

router.post('/excursions', (req, res)=>{
    let sql =`SELECT gc.id AS id, a.activity AS a1, am.activity AS a2, ame.activity AS a3,
    amen.activity AS a4, ameni.activity AS a5, amenit.activity AS a6, bus.name AS TourCompany, 
    gc.cust_nm AS LeadGuest, s.status AS Status, gc.total_cost AS Total, gc.total_guest AS TotalGuest, 
    gc.voucher_num AS VoucherNumber, date_format(gc.excur_dt, '%Y-%m-%d') AS ExcursionDate FROM dolphincove.intinerary 
    AS gc JOIN dolphincove.buscompany AS bus ON gc.tr_comp_id = bus.id JOIN dolphincove.status AS s ON gc.status_id = s.id 
    LEFT JOIN dolphincove.amenities AS a ON gc.activity_id = a.id LEFT JOIN dolphincove.amenities AS am ON gc.activityB_id = am.id 
    LEFT JOIN dolphincove.amenities AS ame ON gc.activityC_id = ame.id LEFT JOIN dolphincove.amenities AS amen ON gc.activityD_id = amen.id 
    LEFT JOIN dolphincove.amenities AS ameni ON gc.activityE_id = ameni.id LEFT JOIN dolphincove.amenities AS amenit ON gc.activityF_id = 
    amenit.id WHERE gc.voucher_num = '${req.body.voucher_num}'`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('myExcursions',{
            data: rows
        })
    })
})

module.exports = router