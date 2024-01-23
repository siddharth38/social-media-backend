const router = require("express").Router();
const User = require("../database/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { myProfile, logout } = require("../controller/user");
const Feed = require("../database/Feed");
const isAuthenticated = require("../GoogleMiddleware/auth");
const ObjectId = mongoose.Types.ObjectId;
//google authentication

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/logIn",
  passport.authenticate("google", {
    successRedirect: "https://besthealing.baavlibuch.com",
  })
);

// router.get(
//   "/logIn",
//   passport.authenticate("google", {
//     session: false,
//   }),
//   (req, res) => {
//     const userData = req.user;
//     console.log(userData);
//     const redirectUrl = `http://localhost:3001/?id=${userData.id}`;
//     res.redirect(redirectUrl);
//   }
// );

router.get("/me", isAuthenticated, myProfile);

router.get("/logout", logout);

//end google authentication

router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  console.log("called");
  User.findOne({ name: name }, async (err, user) => {
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign(
          { name: user.name, userId: user._id },
          "ajw065123",
          {
            expiresIn: "1h",
          }
        );

        res.send({
          message: "Login Successfull",
          name: user.name,
          userId: user._id,
          token,
        });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});
// register controller
router.post("/register", (req, res) => {
  const { name, password, profession, dob, phone } = req.body;
  User.findOne({ name: name }, async (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        phone,
        dob,
        profession,
        password: hashedPassword,
      });
      user.save((err) => {
        if (err) {
          res.send({ message: "Error in login" });
        } else {
          res.send({
            message: "Successfully Registered, Please login now.",
            userId: user._id,
            name: user.name,
          });
        }
      });
    }
  });
});

//user profile delete route and id is the name of user get in request
router.delete("/deleteProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findOneAndDelete({ name: id });
    res.status(200).send({
      success: true,
      message: "Deleted User profile",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "error in user id",
    });
  }
});

//delete user post id from feed array
router.delete("/deleteFeedPost/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const postId = mongoose.Types.ObjectId(id);

    const user = await User.findOne({ name: name });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { name: name },
      { $pull: { posts: postId } },
      { new: true }
    );
    await Feed.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      message: "Deleted post ID from user successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Error in deleting post ID from user",
    });
  }
});

module.exports = router;
