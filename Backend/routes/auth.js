const express = require('express');
const User = require('../models/User');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchUser = require('../MiddleWare/fetchUser');
const JWT_SECRETKEY = "Happy$Home";

// router 2: Create a User using: POST "/api/auth/". Doesn't require Auth 
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
] , async (req, res)=>{ 
    let success = false;
    // if their are errors return bad requests and error 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,errors: errors.array() });
    }
    // check whether the user with email exits already
    try{
      let user = await User.findOne({email : req.body.email}); 
      if(user){
        return res.status(400).json({success,error : "Sorry a user with this emial already exits"})
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt);

      //create user 
      user = await User.create({
          name: req.body.name,
          password: secPass,
          email: req.body.email,
        })

      const data = {
        user:{
          id : user.id
        }
      }

      const authToken = jwt.sign(data,JWT_SECRETKEY);
      // console.log(authToken);

      // res.json(user)
      success = true;
      res.json({success,authToken});
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Internal Server Occured : some error occured")
    }
 
} )

// router 2: authentication user POST : /api/auth/login . no login required
router.post('/login',[
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cant be blank').exists()
] , async (req, res)=>{ 
  let success = false;
  // if their are errors return bad requests and error 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;  
  try {
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({success,error:"Please try to login with correct credentials"});
    }
    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      return res.status(400).json({success,error:"Please try to login with correct credentials"});
    }
    const data = {
      user:{
        id : user.id
      }
    }
    const authToken = jwt.sign(data,JWT_SECRETKEY);
    success = true;
    res.json({success,authToken});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Occured : some error occured")
  }

})


// router : 3 get users details POST : /api/auth/getUser Login required
router.post('/getUser',fetchUser, async (req, res)=>{ 
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Occured : some error occured")
  }
})
module.exports = router