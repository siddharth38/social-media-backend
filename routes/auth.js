const router = require("express").Router();
const User = require('../database/User');
const bcrypt = require("bcrypt");
const  jwt = require("jsonwebtoken");
//login controller
router.post("/login", (req, res) => {
    const { name, password } = req.body
	console.log('called')
    User.findOne({ name: name }, async (err, user) => {
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const token = jwt.sign(
                    {  name: user.name, userId:  user._id },
                    "ajw065123",
                    {
                      expiresIn: "1h",
                    }
                  );
              
                res.send({ message: "Login Successfull",name: user.name, userId:  user._id ,token })

            } else {
                res.send({ message: "Password didn't match" })
            }
        } else {
            res.send({ message: "User not registered" })
        }
    })
})
// register controller
router.post("/register", (req, res) => {
    const { name, password ,profession , dob , phone } = req.body
    User.findOne({ name: name }, async (err, user) => {
        if (user) {
            res.send({ message: "User already registered" })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                phone ,
                dob ,
                profession ,
                password: hashedPassword,
            })
            user.save(err => {
                if (err) {
                    res.send({message : "Error in login"})
                } else {
                    res.send({ message: "Successfully Registered, Please login now.", userId: user._id, name: user.name })
                }
            })
        }
    })

})
module.exports = router;
