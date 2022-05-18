const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

//=================================
//             User
//=================================

router.get('/findUser', (req, res) =>{
    const {_id} = req.query;
    console.log(_id)

    User.findOne({"_id": _id}).exec((err, userInfo) =>{
        if(err) return res.status(400).send(err);
        if(!userInfo) return res.status(200).json({ess : false});
        return res.status(200).json({ess: true});
    })
})

router.post('/signUp', (req, res) =>{
    const user = new User(req.body)
    user.save((err, doc) =>{
        if(err) return res.status(400).json({success: false, err});
        return res.status(200).json({success: true})
    })
})

router.get('/userProfile', (req, res) =>{
    const {_id} = req.query;
    User.findOne({"_id" : _id})
    .exec((err, userInfo) =>{
        console.log(userInfo)
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success:true, userInfo})
    })
})
module.exports = router;
