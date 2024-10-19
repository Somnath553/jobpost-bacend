const express = require('express');
const jwt = require('jsonwebtoken');
const Company = require('../model/Company');
const fetchuser = require('../middleware/getuser')
const { body, validationResult } = require('express-validator');
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer");
const router =  express.Router();
const dotenv = require("dotenv")
dotenv.config()
const JWt_SECRET = 'myjwtsom@u';
var transporter =nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASS}`,
  },
})
// TODO:   Rote 1


router.post('/createuser',async(req,res) => {
  let success = false;

    try {
        let otp= otpGenerator.generate (6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets: false});
     let user= await  Company.create({
        name: req.body.name,
        phone: req.body.phone,
        companyName: req.body.companyName,
        companyEmail: req.body.companyEmail,
         employeeSize: req.body.employeeSize,
         otp: otp,
      })
      const data={
        user: {
        id:user.id
        }
      }
        var mailOptions = {
            from: 'somnath553.in@gmail.com',
            to: req.body.companyEmail,
            subject: 'OTP',
            text: " Here is your "+ otp
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
        });

      const authtoken=jwt.sign(data,JWt_SECRET);
      success=true;
      res.json({success,authtoken});
    }
    catch (err) {
        console.error(err);
        success=false;
        res.status(400).json({success, message: err})
    }
})

// TODO:   Rote 3
router.post('/getuser', fetchuser, async (req, res) => {
    try {
      let userId=req.user.id;
      const user = await Company.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }

});
//TODO:   Rote4

router.post('/otp'
,fetchuser,async (req, res) => {

    let success= false;
        let userId=req.user.id;
        const user = await Company.findById(userId).select("-password");
        if(req.body.otp=== user.otp.toString())
        {
            res.send({success:true});
        }
        else
        {
            res.status(500).send("wrong otp");
        }

    try {



  

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }

});

router.post('/postJob',fetchuser,async(req, res)=>{
    try {
        let data=req.body;
        let message =`Job Description: ${data.jobDescription} Experince: ${data.experienceLevel} End date: ${data.endDate}`
        // let maillist=data.candidateEmail.split(" ");
        let userId=req.user.id;
        const user = await Company.findById(userId).select("-password");
        try {
            var mailOptions = {
              from: user.companyEmail,
              to: data.candidateEmail,
              subject: `${data.jobTitle}  `,
              text: message
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                  res.status(500).send("Internal Server Error");
              } else {
                success = true;
                res.send({sucess:true});
              }
            });
    
          } catch (error) {
            res.status(500).send("Internal Server Error");
          }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router
