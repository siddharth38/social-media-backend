const Question = require("../database/Question");
const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const axios = require("axios");
const WebSocket = require("ws");
const MEDISEARCH_KEY = "df28d43f-70bd-449a-a2d6-15396eb5d25a";

// question routes
router.post("/question/ask", auth, async (req, res) => {
  const postQuestionData = req.body;
  const postQuestion = new Question(postQuestionData);
  try {
    await postQuestion.save();
    res.status(200).json("Posted a question successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Couldn't post a new question");
  }
});

router.get("/question/get", async (req, res) => {
  try {
    const questionList = await Question.find();
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.patch("/question/vote/:id", auth, async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }
  try {
    const question = await Question.findById(_id);
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await Question.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
});

router.delete("/question/delete/:id", auth, async (req, res) => {
  const { id: _id } = req.params;
  console.log(_id);
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    await Question.findByIdAndRemove(_id);
    res.status(200).json({ message: "successfully deleted..." });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

// answer from the questions
// this is how answer is posted to database

router.patch("/answer/post/:id", auth, async (req, res) => {
  const { id: _id } = req.params;
  const { noOfAnswers, answerBody, userAnswered, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }
  updateNoOfQuestions(_id, noOfAnswers);
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerBody, userAnswered, userId }] },
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(404).json("error in updating");
  }
});

const updateNoOfQuestions = async (_id, noOfAnswers) => {
  try {
    await Question.findByIdAndUpdate(_id, {
      $set: { noOfAnswers: noOfAnswers },
    });
  } catch (error) {
    console.log(error);
  }
};
router.patch("/answer/delete/:id", auth, async (req, res) => {
  const { id: _id } = req.params;
  const { answerId, noOfAnswers } = req.body;

  console.log(_id);

  console.log(answerId);

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(404).send("Answer unavailable...");
  }
  updateNoOfQuestions(_id, noOfAnswers);
  try {
    await Question.updateOne({ _id }, { $pull: { answer: { _id: answerId } } });
    res.status(200).json({ message: "Successfully deleted..." });
  } catch (error) {
    res.status(405).json(error);
  }
});

router.post("/MediSearch", async (req, res) => {
  try {
    const { question } = req.body;

    const ws = new WebSocket(
      "wss://public.backend.medisearch.io:443/ws/medichat/api"
    );

    ws.on("open", function open() {
      const settings = { language: "English" };
      const chatContent = {
        event: "user_message",
        conversation: [question],
        settings: settings,
        key: MEDISEARCH_KEY,
        id: generateID(),
      };

      ws.send(JSON.stringify(chatContent));
    });
    let message = "";

    ws.on("message", function incoming(data) {
      const strData = data.toString("utf8");
      const jsonData = JSON.parse(strData);

      if (jsonData.event === "articles") {
        res.send(message);
      } else if (jsonData.event === "llm_response") {
        message = jsonData.text;
      } else if (jsonData.event === "error") {
        console.log("Got error:", jsonData.error);

        // Send a single response to the client after processing WebSocket messages
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    ws.on("error", function error(err) {
      console.log("WebSocket Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Generate a random ID function
function generateID() {
  let id = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 32; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return id;
}

module.exports = router;
