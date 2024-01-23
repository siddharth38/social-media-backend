const router = require("express").Router();
const auth = require("../middleware/auth");
const Follow = require("./../database/Follow");
const User = require("./../database/User");

router.get("/get", auth, async (req, res) => {
  const todos = await User.find({});
  res.json(todos);
});

router.get("/search", async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const sanitizedSearchTerm = searchTerm.trim().toLowerCase();
    const users = await User.find({
      name: { $regex: sanitizedSearchTerm, $options: "i" },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/gets/:id", auth, async (req, res) => {
  const todos = await User.find({ name: req.params.id });
  res.json(todos);
});

router.put("/task", auth, async (req, res) => {
  if (req.body.friends_name === req.body.name) {
    return res.status(200).json({ message: "Could not add self as friend" });
  }
  if (req.body.friends_name == "Add Friends") {
    return res.status(200).json({ message: "Enter a valid field" });
  }
  try {
    const createUserA = await Follow.find({ name: req.body.name });
    if (!createUserA.length) {
      const userfollow = new Follow({
        userId: req.body.Id,
        name: req.body.name,
      });
      userfollow.save();
    }
    const createUserB = await Follow.find({ name: req.body.friends_name });
    if (!createUserB.length) {
      const userfollow = new Follow({
        userId: req.body.friends_id,
        name: req.body.friends_name,
      });
      userfollow.save();
    }
    //<--- friends push
    const userfollowA = await User.find({ name: req.body.name });
    if (userfollowA[0].follows.includes(req.body.friends_name)) {
      console.log("Already a friend!");
    } else {
      userfollowA[0].follows.push(req.body.friends_name);
      const fprdo = await userfollowA[0].save();
      const userfollowB = await User.find({ name: req.body.friends_name });
      if (userfollowB.length) {
        userfollowB[0].follows.push(req.body.name);
        userfollowB[0].save();
      }

      console.log(`Sucessfully Added!`);
    }
    //---->
    if (createUserA[0].friends.includes(req.body.friends_name)) {
      res.status(200).json({ message: "Already a friend!" });
    } else {
      createUserA[0].friends.push(req.body.friends_name);
      const fprdo = await createUserA[0].save();
      const add_to_B = await Follow.find({ name: req.body.friends_name });
      if (add_to_B.length) {
        add_to_B[0].friends.push(req.body.name);
        add_to_B[0].save();
      }

      res.status(200).json({ message: "Sucessfully Added!" });
    }

    //
  } catch (error) {
    console.log(error);
    res.json({ status: "Could not Follow the user" });
  }
});

module.exports = router;
