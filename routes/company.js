var express = require('express');
const flash = require('express-flash');
const res = require('express/lib/response');
const conn = require('../lib/db');
var router = express.Router();

router.get('/',(req, res)=>{
    let Asql="SELECT * FROM amenities"
    let Tsql ="SELECT * FROM buscompany"
    let Hsql = "SELECT * FROM hotels"
    conn.query(Asql, (err, rows)=>{
        if(err) throw err
        conn.query(Tsql, (err, buses)=>{
            if(err) throw err
            conn.query(Hsql, (err, hotels)=>{
               if(err) throw err
               res.render('company',{
                title:"Company",
                data:rows,
                datA:buses,
                Data:hotels
               })
            })
        })
    })
})

router.post('/booking', (req, res)=>{
    let data = {
                 cust_nm: req.body.ld_nm,
                 tour_comp_id: req.body.tr_comp,
                 hotel_id: req.body.hotel,
                 activity_id:  req.body.act[0],
                 activityB_id: req.body.act[1],
                 activityC_id: req.body.act[2],
                 activityD_id: req.body.act[3],
                 activityE_id: req.body.act[4],
                 activityF_id: req.body.act[5],
                 quantity: req.body.quant,
                 qt_per_act: req.body.qt,
                 booked_dt: req.body.curr_dt,
                 excur_dt: req.body.excur_dt
               }

    let sql = "INSERT INTO guestcart SET ?"
    conn.query(sql, data, (err, rows)=>{
        if(err) throw err
        res.redirect('/company')
    })
})

router.get('/cart', (req, res)=>{
    res.render('guestcart',{
        title: "Cart"
    });
});



router.post('/name', (req, res)=>{
    let sql = `SELECT gc.id AS id,gc.activity_id AS a1, gc.activityB_id AS a2, gc.activityC_id AS a3, gc.activityD_id 
    AS a4, gc.activityE_id AS a5, gc.activityF_id AS a6, gc.tour_comp_id AS Tour, gc.cust_nm AS LeadGuest, bus.name AS 
    TourCompany, h.name AS Hotel, a.activity AS Activity,a.cost AS Price, am.activity AS ActivityB, am.cost AS Price2, 
    ame.activity AS ActivityC, ame.cost AS Price3, amen.activity AS ActivityD, amen.cost AS Price4, ameni.activity AS 
    ActivityE, ameni.cost AS Price5, amenit.activity AS ActivityF,amenit.cost AS Price6,gc.hotel_id AS hID,
    gc.quantity AS TotalGuest ,gc.qt_per_act AS QuantityperActivity, date_format(gc.booked_dt, '%Y-%m-%d') AS DateBooked, 
    date_format(gc.excur_dt, '%Y-%m-%d') AS ExcursionDate FROM dolphincove.guestcart AS gc JOIN dolphincove.buscompany AS
    bus ON gc.tour_comp_id = bus.id JOIN dolphincove.hotels AS h ON gc.hotel_id = h.id LEFT JOIN dolphincove.amenities AS 
    a ON gc.activity_id = a.id LEFT JOIN dolphincove.amenities AS am ON gc.activityB_id = am.id LEFT JOIN dolphincove.amenities
    AS ame ON gc.activityC_id = ame.id LEFT JOIN dolphincove.amenities AS amen ON gc.activityD_id = amen.id LEFT JOIN 
    dolphincove.amenities AS ameni ON gc.activityE_id = ameni.id LEFT JOIN dolphincove.amenities AS amenit ON gc.activityF_id = 
    amenit.id WHERE bus.name like '%${req.session.username}%' AND gc.cust_nm LIKE '%${req.body.cust_nm}%'`

     conn.query(sql, (err, rows)=>{
        if(err) throw err
        if(rows.length <= 0){
            res.redirect('/company/cart');
        }else{
            res.render('cart',{
                data:rows
            });
         };
     });
});

router.get('/edit/:id', (req, res)=>{
    let Asql="SELECT * FROM amenities"

    let sql = `SELECT gc.id AS id, gc.cust_nm AS LeadGuest, bus.name AS TourCompany, h.name AS Hotel,
    a.activity AS Activity, am.activity AS ActivityB, ame.activity AS ActivityC, amen.activity AS ActivityD,
    ameni.activity AS ActivityE, amenit.activity AS ActivityF, gc.quantity AS TotalGuest ,gc.qt_per_act AS
    QuantityperActivity, date_format(gc.booked_dt, '%Y-%m-%d') AS DateBooked, date_format(gc.excur_dt, '%Y-%m-%d') 
    AS ExcursionDate FROM dolphincove.guestcart 
    AS gc JOIN dolphincove.buscompany AS bus ON gc.tour_comp_id = bus.id JOIN dolphincove.hotels AS h ON 
    gc.hotel_id = h.id LEFT JOIN dolphincove.amenities AS a ON gc.activity_id = a.id LEFT JOIN dolphincove.amenities
    AS am ON gc.activityB_id = am.id LEFT JOIN dolphincove.amenities AS ame ON gc.activityC_id = ame.id LEFT JOIN 
    dolphincove.amenities AS amen ON gc.activityD_id = amen.id LEFT JOIN dolphincove.amenities AS ameni ON 
    gc.activityE_id = ameni.id LEFT JOIN dolphincove.amenities AS amenit ON gc.activityF_id = amenit.id WHERE 
    gc.id = ${req.params.id}`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        conn.query( Asql, (err, amen)=>{
            if(err) throw err
            res.render("editexcur",{
                data:rows[0],
                Data: amen
            });
        });
    });
});

router.post('/update', (req, res)=>{
       const id = req.body.id;

       let sql = "UPDATE guestcart SET activity_id ='"+req.body.act[0]+"',activityB_id ='"+req.body.act[1]+"',activityC_id ='"+req.body.act[2]+"',activityD_id ='"+req.body.act[3]+"',activityE_id ='"+req.body.act[4]+"',activityF_id ='"+req.body.act[5]+"',quantity ='"+req.body.quant+"',qt_per_act ='"+req.body.qt+"',excur_dt ='"+req.body.excur_dt+"' WHERE id ="+id;

       conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.redirect('/company/cart')
       });
});

router.get('/delete/:id', (req, res)=>{
    let sql = `DELETE FROM guestcart WHERE id = ${req.params.id}`
    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.redirect('/admin/walk-ins')
    })
})

router.post('/checkout',(req, res)=>{
    let tCost = parseInt(req.body.p1 + req.body.p2 + req.body.p3 + req.body.p4 + req.body.p5 + req.body.p6);
    let gTotal = tCost * parseInt(req.body.t_guest);
    let voucherNumber = Math.floor(Math.random() *100) + "DC" + new Date().toJSON().slice(0,10).split('-').reverse().join('');

    let data ={
                cust_nm: req.body.cust_nm,
                tr_comp_id: req.body.tc,
                activity_id: req.body.a1,
                activityB_id: req.body.a2,
                activityC_id: req.body.a3,
                activityD_id: req.body.a4,
                activityE_id: req.body.a5,
                activityF_id: req.body.a6,
                origin: req.body.hot_id,
                total_guest: req.body.t_guest,
                total_cost : req.body.gPrice,
                excur_dt: req.body.excur,
                voucher_num : voucherNumber
              }
    let sql ="INSERT INTO intinerary SET?"
    conn.query(sql, data, (err, rows)=>{
        if(err) throw err
        res.redirect('/company')
    })
})


router.get('/vouchers', (req,res)=>{
    let sql = `SELECT gc.id AS id,a.activity AS a1, am.activity AS a2, ame.activity AS a3,
    amen.activity AS a4, ameni.activity AS a5, amenit.activity AS a6, bus.name AS TourCompany, 
    gc.cust_nm AS LeadGuest, s.status AS Status, gc.total_cost AS Total, gc.total_guest AS TotalGuest, 
    gc.voucher_num AS VoucherNumber, date_format(gc.excur_dt, '%Y-%m-%d') AS ExcursionDate FROM dolphincove.intinerary 
    AS gc JOIN dolphincove.buscompany AS bus ON gc.tr_comp_id = bus.id JOIN dolphincove.status AS s ON gc.status_id = s.id 
    LEFT JOIN dolphincove.amenities AS a ON gc.activity_id = a.id LEFT JOIN dolphincove.amenities AS am ON gc.activityB_id = am.id 
    LEFT JOIN dolphincove.amenities AS ame ON gc.activityC_id = ame.id LEFT JOIN dolphincove.amenities AS amen ON gc.activityD_id = amen.id 
    LEFT JOIN dolphincove.amenities AS ameni ON gc.activityE_id = ameni.id LEFT JOIN dolphincove.amenities AS amenit ON gc.activityF_id = 
    amenit.id WHERE bus.name = '${req.session.username}'`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('itinerary',{
            data:rows
        })
    })
})
module.exports = router