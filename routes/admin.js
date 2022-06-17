var express = require('express');
const flash = require('express-flash');
const res = require('express/lib/response');
const conn = require('../lib/db');
var router = express.Router();

router.get('/',(req, res)=>{
    let sql = "SELECT * FROM amenities"

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('admin',{
            title:"Admin",
            data: rows
        });
    });
});

router.get('/addActivity', (req, res)=>{
    res.render('addActivity',{
        title:"AMENITIES"
    })
})

router.post('/postActivity', (req,res)=>{
    let data = {
                 act: req.body.act_nm,
                  cost: req.body.price
               }

    let sql = "INSERT INTO amenities SET ?"

    conn.query(sql, data, (err, rows)=>{
        if(err) throw err
        res.redirect('/admin')
    });
});

router.get('/deleteact/:id', (req, res)=>{
    let sql = `DELETE FROM amenities WHERE id= ${req.params.id}`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.redirect('/admin')
    })
})

router.get('/edit/:id', (req, res)=>{
    let sql = `SELECT * FROM amenities WHERE id = ${req.params.id}`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('activityEdit', {
            data: rows[0]
        });
    });
});

router.post('/update', (req, res)=>{
    const id = req.body.id;

    let data ={
                cost: req.body.new_cost
              }

    let sql = "UPDATE amenities SET cost ='"+req.body.new_cost+"' WHERE id ="+id; 
    conn.query(sql, data, (err, rows)=>{
     if(err) throw err
     res.redirect('/admin')
    });
});


router.get('/companies', (req, res)=>{
    let sql ="SELECT * FROM buscompany"
    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render("tourComp",{
            data: rows
        });
    });
});

router.get('/compEdit/:id', (req, res)=>{
    let sql = `SELECT * FROM buscompany WHERE id =${req.params.id}`
    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('compEdit',{
          data: rows[0]
        });
    });
});

router.post('/compUpdate', (req, res)=>{
    const id = req.body.id;
    let udata={
        password: req.body.password
    }
    let sql = "UPDATE buscompany SET email ='"+req.body.mail+"',password ='"+req.body.password+"' WHERE id ="+id; 

    let userUpdate = `UPDATE users SET password = ${req.body.password} WHERE user_nm = ${req.body.name}`
    
    conn.query(sql, (err, rows)=>{
     if(err) throw err
     conn.query(userUpdate, udata, (err, rows)=>{
        if(err)throw err
        res.redirect('/admin')
      });
    });
});

router.get('/add', (req, res)=>{
    res.render('registerComp',{
        title: "Registration Company"
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
            res.redirect('/admin')
        });
    });
});

router.get('/walk-ins', (req, res)=>{
    let sql="SELECT * FROM amenities"

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('walk-ins',{
            title:"BOOK EXCURSION",
            data:rows
        })
    })
})

router.post('/booking', (req, res)=>{
        let data = {
        cust_nm: req.body.ld_nm,
        activityA_id: req.body.act[0],
        activityB_id: req.body.act[1],
        activityC_id: req.body.act[2],
        activityD_id: req.body.act[3],
        activityE_id: req.body.act[4],
        activityF_id: req.body.act[5],
        quantity: req.body.quant,
        qt_per_act: req.body.qt,
        date_booked: req.body.curr_dt,
        excur_dt: req.body.excur_dt,
        }

    let sql = "INSERT INTO localscart SET ?"
       conn.query(sql, data, (err, rows)=>{
        if(err) throw err
        res.redirect('/admin/walk-ins')
    });
});

router.get('/cart', (req, res)=>{
    let sql = `SELECT gc.id AS id, a.activity AS a1, am.activity AS a2, ame.activity AS a3, amen.activity 
    AS a4, ameni.activity AS a5, amenit.activity a6, gc.cust_nm AS LeadGuest, a.id AS AID, a.activity AS act,a.cost AS Price,
    am.activity AS actB, am.id AS AMID, am.cost AS Price2, ame.id AS AMEID,ame.activity AS actC, ame.cost AS Price3, amen.activity AS actD, 
    amen.cost AS Price4, amen.id AS AMENID, ameni.id AS AMENIID,ameni.activity AS actE, ameni.cost AS Price5, 
    amenit.id AS AMENITID, amenit.activity AS actF,amenit.cost AS Price6, 
    gc.quantity AS TotalGuest ,gc.qt_per_act AS QuantityperActivity, date_format(gc.date_booked, '%Y-%m-%d') AS DateBooked, 
    date_format(gc.excur_dt, '%Y-%m-%d') AS ExcursionDate FROM dolphincove.localscart AS gc LEFT JOIN dolphincove.amenities AS 
    a ON gc.activityA_id = a.id LEFT JOIN dolphincove.amenities AS am ON gc.activityB_id = am.id LEFT JOIN dolphincove.amenities
    AS ame ON gc.activityC_id = ame.id LEFT JOIN dolphincove.amenities AS amen ON gc.activityD_id = amen.id LEFT JOIN 
    dolphincove.amenities AS ameni ON gc.activityE_id = ameni.id LEFT JOIN dolphincove.amenities AS amenit ON gc.activityF_id = 
    amenit.id`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('wCart',{
            data:rows
        })
    })
})

router.get('/Cartedit/:id', (req, res)=>{
    let sql = `SELECT gc.id AS id,gc.activityA_id AS a1, gc.activityB_id AS a2, gc.activityC_id AS a3, gc.activityD_id 
    AS a4, gc.activityE_id AS a5, gc.activityF_id AS a6, gc.cust_nm AS LeadGuest, a.activity AS act,a.cost AS Price,
    am.activity AS actB, am.cost AS Price2, ame.activity AS actC, ame.cost AS Price3, amen.activity AS actD, 
    amen.cost AS Price4, ameni.activity AS actE, ameni.cost AS Price5, amenit.activity AS actF,amenit.cost AS Price6, 
    gc.quantity AS TotalGuest ,gc.qt_per_act AS QuantityperActivity, date_format(gc.date_booked, '%Y-%m-%d') AS DateBooked, 
    date_format(gc.excur_dt, '%Y-%m-%d') AS ExcursionDate FROM dolphincove.localscart AS gc LEFT JOIN dolphincove.amenities AS 
    a ON gc.activityA_id = a.id LEFT JOIN dolphincove.amenities AS am ON gc.activityB_id = am.id LEFT JOIN dolphincove.amenities
    AS ame ON gc.activityC_id = ame.id LEFT JOIN dolphincove.amenities AS amen ON gc.activityD_id = amen.id LEFT JOIN 
    dolphincove.amenities AS ameni ON gc.activityE_id = ameni.id LEFT JOIN dolphincove.amenities AS amenit ON gc.activityF_id = 
    amenit.id WHERE gc.id = ${req.params.id}`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render("editCart",{
            data:rows[0]
        });
    });
});


router.post('/cartUpdate', (req, res)=>{
    const id = req.body.id;

    let data ={
    activityA_id: req.body.act[0],
    activityB_id: req.body.act[1],
    activityC_id: req.body.act[2],
    activityD_id: req.body.act[3],
    activityE_id: req.body.act[4],
    activityF_id: req.body.act[5],
     quantity: req.body.quant,
     qt_per_act: req.body.qt,
     excur_dt: req.body.excur_dt
    }

    let sql = "UPDATE localscart SET ?"; 
    conn.query(sql, data, (err, rows)=>{
     if(err) throw err
     res.redirect('/admin/cart')
    });
});

router.post('/checkout',(req, res)=>{
    voucherNumber = Math.floor(Math.random() *200) + "DC" + new Date().toJSON().slice(0,10).split('-').reverse().join('')
    let data ={
                cust_nm: req.body.cust_nm,
                actA_id: req.body.a1_id,
                actB_id: req.body.a2_id,
                actC_id: req.body.a3_id,
                actD_id: req.body.a4_id,
                actE_id: req.body.a5_id,
                actF_id: req.body.a6_id,
                tot_guest: req.body.t_guest,
                total_cost : parseInt(req.body.p1 + req.body.p2 + req.body.p3 + req.body.p4 + req.body.p5 + req.body.p6)*req.body.t_guest,
                excur_dt: req.body.excur,
                voucher_num : voucherNumber
              }
    let sql ="INSERT INTO localitinerary SET?"
    conn.query(sql, data, (err, rows)=>{
        if(err) throw err
        res.redirect('/admin/lItinerary')
    });
});

router.get('/lItinerary', (req, res)=>{
    let sql=`SELECT  gc.cust_nm AS LeadGuest,gc.total_cost AS TotalCost,  a.activity AS act,am.activity AS actB, ame.activity AS actC, 
    amen.activity AS actD, ameni.activity AS actE,amenit.activity AS actF, gc.voucher_num AS Voucher, gc.tot_guest
    AS TotalGuest , s.status AS Status, date_format(gc.excur_dt, '%Y-%m-%d') AS ExcursionDate FROM dolphincove.localitinerary 
    AS gc LEFT JOIN dolphincove.amenities AS a ON gc.actA_id = a.id LEFT JOIN dolphincove.amenities AS am ON gc.actB_id = am.id 
    LEFT JOIN dolphincove.amenities AS ame ON gc.actC_id = ame.id LEFT JOIN dolphincove.amenities AS amen ON gc.actD_id = amen.id 
    LEFT JOIN dolphincove.amenities AS ameni ON gc.actE_id = ameni.id LEFT JOIN dolphincove.amenities AS amenit ON gc.actF_id = 
    amenit.id JOIN dolphincove.status AS s ON gc.stat_id = s.id;`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('Witinerary',{
            data:rows
        })
    })
})

module.exports = router