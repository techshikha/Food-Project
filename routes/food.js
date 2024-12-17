const express = require('express')

const router = express.Router()
const upload = require('./multer')
const pool = require("./pool")
const fs = require('fs')
const { fstat } = require('fs')

router.get('/food_interface', function (req, res) {
  res.render('foodinterface', { message: '' })
})
router.post('/submit_food', upload.single('foodpicture'), function (req, res) {
  console.log(req.body)
  console.log(req.file)
  try {
    pool.query("insert into fooditems(categoryid, subcategoryid, foodname, ingredients, description, price, offerprice,foodtype,status,foodpicture) value(?,?,?,?,?,?,?,?,?,?)",
      [req.body.categoryid, req.body.subcategoryid, req.body.foodname, req.body.indgredients, req.body.description, req.body.price,
      req.body.offerprice, req.body.foodtype, req.body.status, req.file.filename],
      function (error, result) {
        if (error) {
          console.log("Error:", error)
          res.render('foodinterface', { message: 'there is issue in database..pls contact with data administrator' })
        }
        else {
          res.render('foodinterface', { message: 'food item submitted successfully...' })

        }
      })
  }
  catch (e) {
    res.render('foodinterface', { message: 'server error.. pls  contact with backend team' })
  }
})
router.get('/fillcategory', function (req, res) {

  try {





    pool.query("select * from category", function (error, result) {
      if (error) {
        res.json({ data: [], status: false, message: 'data error ...pls contact with database administrator' })
      }
      else {
        res.json({ data: result, status: true, message: 'success' })

      }
    })
  }
  catch (e) {
    res.json({ data: [], status: false, message: 'servar error ...pls contact with backend tea' })


  }



})



router.get('/fillsubcategory', function (req, res) {

  try {



    pool.query("select * from subcategory where categoryid =?", [req.query.categoryid], function (error, result) {
      if (error) {
        res.json({ data: [], status: false, message: 'data error ...pls contact with database administrator' })
      }
      else {
        res.json({ data: result, status: true, message: 'success' })

      }
    })
  }
  catch (e) {
    res.json({ data: [], status: false, message: 'servar error ...pls contact with backend tea' })


  }



})
router.get('/display_all_food', function (req, res) {
  try {


    pool.query("select F.*,(select C.categoryname from category C where C.categoryid=F.categoryid) as categoryname ,(select S. subcategoryname from subcategory S where S.subcategoryid=F.subcategoryid) as subcategoryname from fooditems F", function (error, result) {
      if (error) {
        res.render('displayallfood', { status: false, data: [] })
      }
      else {
        res.render('displayallfood', { status: true, data: result })

      }
    })
  }
  catch (e) {
    res.render('displayallfood', { status: false, data: [] })

  }
})

router.get('/show_food', function (req, res) {

  pool.query("select F.*,(select C.categoryname from category C where C.categoryid=F.categoryid) as categoryname ,(select S. subcategoryname from subcategory S where S.subcategoryid=F.subcategoryid) as subcategoryname from fooditems F where F.foodid=?", [req.query.foodid], function (error, result) {
    if (error) {
      res.render('showfood', { status: false, data: [] })
    }
    else {
      console.log(result)
      res.render('showfood', { status: true, data: result[0] })

    }
  })


})

router.get('/food_login', function (req, res) {
  res.render('adminlogin')


})

router.post('/update_food_data', function (req, res) {
  console.log(req.body)
  if (req.body.btn == "Edit") {
    pool.query("update fooditems set categoryid=?,subcategoryid=?,foodname=?,ingredients=?,description=?,price=?,offerprice=?,foodtype=?,status=? where foodid=?", [req.body.categoryid, req.body.subcategoryid, req.body.foodname, req.body.ingredients, req.body.description, req.body.price,
    req.body.offerprice, req.body.foodtype, req.body.status, req.body.foodid], function (error, result) {
      if (error) {

        // console.log(error)
        res.redirect('/food/display_all_food')
      }

      else {
        // console.log(result)

        res.redirect('/food/display_all_food')

      }
    })
  }
  else {
    pool.query("delete from fooditems where foodid=?", [req.body.foodid], function (error, result) {
      if (error) {
        res.redirect('/food/display_all_food')
      }
      else {
        console.log(result)
        res.redirect('/food/display_all_food')

      }
    })
  }
})
router.get('/show_picture', function (req, res) {
  res.render("showpicture", { data: req.query })
  console.log(req.query)

})
router.post('/edit_picture',upload.single('foodpicture'),function(req,res){
   pool.query("update fooditems set foodpicture=? where foodid=?",[req.file.filename,req.body.foodid],function(error,result){
   if(error)
    {
      res.redirect('/food/display_all_food')
    }
    else
    {
      res.redirect('/food/display_all_food')
      
      fs.unlink(`e:/foodproject/pubilc/images/${req.body.oldfoodpicture}`,function(error){
        if(error)
          {
            console.log(req.body.oldfoodpicture)
             console.log("error",error)
          }
          else{
             console.log("deleted")
          }
      })

    }
})
})
 router.get('/enter_foodid',function(req,res){
  res.render("update")
 })



module.exports = router
