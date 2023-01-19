const express = require("express")
const bcrypt = require("bcrypt")
const UserModel  = require("../models/User.model")
const jwt = require("jsonwebtoken")
const userController = express.Router();


userController.post("/signup",  (req, res) => {

    const {email, password} = req.body;
    
    bcrypt.hash(password,10, async function(err, hash){

        if(err){
            res.send("internal error")
        }


        const user = new UserModel({
            email,
            password: hash
        })

        try {
            const result = await user.save();
            console.log(result)
            res.send("signup sucessfull")
        } catch (error) {
            console.log(error)
            res.send("Internal error")
        }
    })
    
})

userController.post("/login", async (req, res) => {

    const {email, password} = req.body;
    const user = await UserModel.findOne({email})
    const {_id}=user
    
    if(!user){
        return res.send("your account is not registered with us")
    }
    const hash = user.password;
    const userId = user._id

    bcrypt.compare(password, hash, function(err, result){

       if(result){
        var token = jwt.sign({email, userId}, "secret")
        return res.send({"message": "Login sucess", "token": token,"id":_id})
       }
       else{
        return res.send("Wrong Input")
       }
    })
   
})



module.exports = userController