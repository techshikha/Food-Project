var express =require('express')
var router=express.Router()

var pool = require('./pool')
router.get('/admin_login',function(req,res){
    res.render('adminlogin')
})
router.post('/check_login',function(req,res){

    console.log(req.body)
    pool.query('select * from admins where(emailid=? or mobile=?)and password=?',[req.body.emailid,req.body.emailid,req.body.password], function(error,result){
        if(error)
        {

            console.log("error", error)
            res.render('adminlogin',{data:[],status:false,message:'database error... please contact with database admin'})
        }
        else
        {
            if(result.length==1)
            {
                res.render('dashboard',{data:result[0],status:true,message:'Login success'})
            }
            else{

                console.log('adminlogin')
                res.render('adminlogin',{data:[],status:false,message:'Invalid credentails.'})
            }
        }
    })
})
module.exports=router;