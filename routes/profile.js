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

module.exports = router;
