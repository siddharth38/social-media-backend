const router = require("express").Router();
const Feed = require("../database/Feed");
const upload = require("../config/gridstorage");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const User = require("./../database/User");

const auth = require("../middleware/auth");

router.post("/uploads", auth, upload.single("image"), async (req, res) => {
  console.log("requested data of uploaded file : ", req);
  if (req.file) {
    var imageName = req.file.originalname;
    var contentType = req.file.contentType;
  }
  const feeddata = req.body.data;
  console.log(req.body.id);
  try {
    const userfeed = new Feed({
      userId: req.body.id,
      name: req.body.name,
      content: feeddata,
      image: imageName,
      type: contentType,
    });

    const savedUserFeed = await userfeed.save();

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.body.id },
      { $push: { posts: savedUserFeed._id } }, // Add the post ID to the 'posts' array
      { new: true }
    );

    res.json({ status: "Image Upload successful!" });
  } catch (error) {
    res.json({ status: "Could not Upload the image!" });
  }
});

router.post("/upload", auth, upload.single("image"), async (req, res) => {
  if (req.file) {
    var imageName = req.file.filename;
  }
  const feeddata = req.body.data;
  try {
    const userfeed = new Feed({
      name: req.body.name,
      content: feeddata,
      image: imageName,
    });

    userfeed.save();
    res.json({ status: "Image Upload successful!" });
  } catch (error) {
    res.json({ status: "Could not Upload the image!" });
  }
});

router.get("/comments/:feedId", async (req, res) => {
  try {
    const feedId = req.params.feedId;
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res
        .status(404)
        .json({ status: "error", message: "Feed not found" });
    }
    const comments = feed.comment;
    res.json({ status: "ok", comments });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/comment", auth, async (req, res) => {
  console.log("called");
  try {
    const userId = req.body.userId;
    const feedId = req.body.feedId;
    const commentText = req.body.commentText;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const feed = await Feed.findById(feedId);

    if (!feed) {
      return res
        .status(404)
        .json({ status: "error", message: "Feed not found" });
    }

    // Add the comment to the feed
    feed.comment.push({
      userId: userId,
      text: commentText,
      timestamp: new Date(),
    });

    // Save the updated feed
    await feed.save();

    res.json({ status: "ok", message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 2; // Adjust the page size as needed
    const skip = (page - 1) * pageSize;

    const feeds = await Feed.find({})
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize);
    const conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;
    let gfs = Grid(conn.db);
    gfs.collection("uploads");

    const mappedFeeds = await Promise.all(
      feeds.map(async (feed) => {
        if (!feed.image) {
          return {
            feedDetails: feed,
            fileContent: "",
          };
        }
        const readstream = gfs.createReadStream({ filename: feed.image });
        const fileContent = await streamToPromise(readstream);
        return {
          feedDetails: feed,
          fileContent: `data:image/jpeg;base64,${fileContent}`,
        };
      })
    );

    res.json(mappedFeeds);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
    stream.on("error", (error) => reject(error));
  });
}

// like route

router.post("/like", auth, async (req, res) => {
  try {
    const objectIdToFind = req.body._id;
    console.log(req.body._id);
    const userfeed = await Feed.findById(objectIdToFind).exec();
    if (userfeed) {
      console.log(userfeed.likes);
      const likes = userfeed.likes;
      userfeed.likes = likes + 1;
      userfeed.save();
    }

    res.json({ status: "Image Upload successful!" });
  } catch (error) {
    res.json({ status: "Could not Upload the image!" });
  }
});

//get particular feed details according to particular feed id
router.get("/userPost/:feedId", async (req, res) => {
  const feedId = req?.params?.feedId;
  try {
    const feed = await Feed.findById(feedId);
    if (feed) {
      res.status(200).send({
        success: true,
        message: "user post get successfully",
        feed,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `user post is not present with id : ${feedId}`,
    });
  }
});

//update post content
router.post("/UpdateUserPost/:feedId", async (req, res) => {
  const feedId = req?.params?.feedId;
  try {
    const { content } = req.body;
    if (!content) {
      res.status(500).send({ error: "content is required" });
    }
    const feed = await Feed.findByIdAndUpdate(
      feedId,
      { ...req.body },
      { new: true }
    );

    await feed.save();
    res.status(201).send({
      success: true,
      message: "Post updated successfully",
      feed,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `not able to update post with id : ${feedId}`,
    });
  }
});

module.exports = router;
