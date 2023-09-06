const express = require('express');
const router = express.Router();
require('../DB/conn');
const SmdDivision = require('../DB/SMDDivision')
const Group = require('../DB/Group')
const Division = require('../DB/Division')
const User = require('../DB/module')
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb')


router.get('/user-details/:id', (req, res) => {
  User.findOne({ email: req.params.id }, { _id: 0, name: 1, email: 1, Smdid: 1, Divisionid: 1, Group: 1, status: 1, intrested: 1, starred: 1 })
    .then(resp => res.status(200).send(resp))
    .catch(e => res.status(400).send(e));
})

router.patch('/set-starred/:questionId/:userId', (req, res) => {
  User.findOne({ email: req.params.userId })
    .then(user => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Check if the questionId is already in the starred array
      if (user.starred.includes(req.params.questionId)) {
        return res.status(200).send(user); // Return the user without making changes
      }

      // Update the user document to push the questionId into the starred array
      User.updateOne(
        { email: req.params.userId },
        { $push: { starred: req.params.questionId } }
      )
        .then(() => {
          // Fetch the updated user document to send back in the response
          User.findOne({ email: req.params.userId })
            .then(updatedUser => {
              res.status(200).send(updatedUser);
            })
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
});


router.patch('/remove-starred/:questionId/:userId', (req, res) => {
  User.findOneAndUpdate(
    { email: req.params.userId },
    { $pull: { starred: req.params.questionId } },
    { new: true } // This option returns the updated document
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(updatedUser);
    })
    .catch(error => res.status(400).send(error));
});


//Smd Details fetch
router.get('/smddetail', (req, res) => {

  SmdDivision.find({}, { name: 1 }).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})
//Dvision details fetch
router.get('/smddetail/:id', (req, res) => {

  // SmdDivision.find({ name: req.params.name }).then((resp) => {

  //   console.log(resp)
  //   res.status(200).send(resp)

  // })


  SmdDivision.find({ name: req.params.name }, { _id: 0, division: 1 }).limit(1).then((resp) => {

    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

router.get('/Group', (req,res)=>{

    Group.find({},{name:1,_id:1}).then((resp)=>{
        res.status(200).send(resp)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

router.get('/groupdetail/:name',(req,res)=>{

  const id = new ObjectId(req.params.name)  

    Group.findOne({_id:id},{_id:0,division:1}).then((resp)=>{
               
        Division.find({_id:resp.division}).then((resp)=>{
            res.send(resp)
        })

    })

})

/***************All Subject API****************/
router.get('/subject', (req, res) => {
  Division.find({}, { name: 1 }).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})
/***********************************************/




router.get('/SmdName/:id', (req, res) => {
 
  const id = new ObjectId(req.params.id)

  Group.findOne({_id:id},{_id:0,name:1}).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})


router.get('/SMD', (req, res) => {
  SmdDivision.find({}).then((resp) => {
    res.status(200).send(resp)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

router.get('/get-division/:id', (req, res) => {
  User.findOne({ email: req.params.id }, { Smdid:1, Divisionid:1, intrested:1, status:1 })
    .then(userDetails => {
      if(userDetails.status == 1){
        Division.find({ _id: { $in: [userDetails.Divisionid, ...(userDetails.intrested)] } })
          .then(resp => res.status(200).send(resp))
          .catch(err => res.status(400).send(err))    
      }
      else if(userDetails.status == 2){
        SmdDivision.findOne({ _id: userDetails.Smdid}).then(resp => {
          Division.find({ name: { $in: resp.division } })
            .then(resp => res.status(200).send(resp))
            .catch(err => res.status(400).send(err))
          }
        )
      }
      else if(userDetails.status == 3){
        SmdDivision.find({})
        .then((resp) => { res.status(200).send(resp) })
        .catch((e) => { res.status(400).send(e) })
      }
    }
  )
})

//Group detail fetch from user collection
router.get('/group/:id', (req, res) => {

  User.findOne({ email: req.params.id }, {_id:0,intrested: 1})
    .then((resp) => {     
     Division.find({_id:resp.intrested}).then((rsp)=>{
      res.send(rsp)
     })

    }).catch((e) => {
      res.status(400).send(e)
    })
})

router.get('/MainGroup/:id', (req, res) => {

  User.findOne({ email: req.params.id }, {_id:0,Divisionid: 1})
    .then((resp) => {     
     Division.findOne({_id:resp.Divisionid}).then((rsp)=>{
      res.send(rsp)
     })

    }).catch((e) => {
      res.status(400).send(e)
    })
})


router.get('/main_group/:id', (req, res) => {
  User.find({ email: req.params.id }, { _id: 0, Group: 1 })
    .then((resp) => {
      resp.map((rsp) => {
        SmdDivision.find({ _id: rsp.Group }, { name: 1 })
          .then((grsp) => {
            res.send(grsp)
          })

      })
    })
})

router.get('/user-group',(req,res)=>{

  const id = new ObjectId(req.query.id_1)
  Division.findOne({_id:id},{member:1,name:1}).then((resp)=>{   
    
    User.find({$and:[{email:resp.member},{email:{$ne:req.query.id_2}}]},{_id:0,email:1,name:1}).then((rsp)=>{
      res.status(200).send({rsp,resp})
    })

  }).catch((e)=>{
     res.status(400).send(e)
  })
})

router.get('/smd-group',(req,res)=>{

  const id = new ObjectId(req.query.id_1)

  Group.findOne({_id:id},{division:1,name:1}).then((resp)=>{
  
    Division.find({_id:resp.division},{name:1,member:1}).then((rsp)=>{

      res.status(200).send({resp,rsp})

    })   
  
  }).catch((e)=>{
       res.status(400).send(e)
    })
   

})


module.exports = router;