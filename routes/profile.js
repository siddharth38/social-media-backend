const router = require("express").Router();
const Follow = require("./../database/Follow");
const User = require("./../database/User");

router.get("/get/:id", async (req, res) => {
  console.log(req.params.id);
  const todos = await Follow.find({ name: req.params.id });
  res.json(todos);
});

router.put("/edit/:id", async (req, res) => {
  const todos = await Follow.findById(req.body.name);
  if (!todos) {
    res.send({ message: "Invalid User" });
  }
  try {
    console.log(todos[req.params.id]);
    todos[req.params.id] = req.body.value;
    await todos.save();
    res.send({ message: "successfully updated" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error Occured" });
  }
});

//get all user post details
router.get("/userPostDetails/:name", async (req, res) => {
  try {
    const UserName = req.params.name;
    const checkUser = await User.findOne({ name: UserName });
    if (checkUser) {
      const Posts = checkUser.posts;
      res.send({
        success: true,
        message: " ALL post generated ",
        Posts,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `error in Post of ${req.params.name}`,
    });
  }
});

module.exports = router;
