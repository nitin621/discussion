const express = require('express');
const router = express.Router();
require('../DB/conn');
const SmdDivision = require('../DB/SMDDivision')
const Group = require('../DB/Group')
const User = require('../DB/module')
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb')



//Smd Details fetch
router.get('/smddetail', (req,res)=>{

    SmdDivision.find({},{name:1}).then((resp)=>{
        res.status(200).send(resp)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})
//Dvision details fetch
router.get('/smddetail/:name', (req,res)=>{

    SmdDivision.find({name:req.params.name},{division:1}).limit(1).then((resp)=>{

        res.status(200).send(resp)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

//Group detail fetch from user collection
router.get('/group/:id',(req,res)=>{

       
    User.find({email:req.params.id},{_id:0,Smdid:1})
     .then((resp)=>{       
       
            resp.map((rsp)=>{
                             
                //                   Group.find({_id:rsp.Group},{name:1})
                //    .then((grsp)=>{
                          res.send(rsp)
                //    })
       })
       
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

module.exports = router;