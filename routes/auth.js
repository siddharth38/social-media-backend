const router = require("express").Router();
const User = require('../database/User');
const bcrypt = require("bcrypt");
//login controller
router.post("/login", (req, res) => {
    const { name, password } = req.body
    User.findOne({ name: name }, async (err, user) => {
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                res.send({ message: "Login Successfull", userId: user._id, name: user.name })

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