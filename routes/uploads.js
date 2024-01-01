const router = require("express").Router();
const Feed = require('../database/Feed')
const upload = require('../config/gridstorage')
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const auth = require("../middleware/auth")


router.post("/uploads", upload.single("image"), (req, res) => {
  console.log(`upload called`)
  if (req.file) { var imageName = req.file.originalname;
  var contentType = req.file.contentType }
  const feeddata = req.body.data
console.log(req.body.id)
  try {
    const userfeed = new Feed({
      userId :req.body.id,
      name: req.body.name,
      content: feeddata,
      image: imageName,
      type :contentType
    })

    userfeed.save();
    res.json({ status: "Image Upload successful!" });
  } catch (error) {
    res.json({ status: "Could not Upload the image!" });
  }

});



router.post("/upload", upload.single("image"), async (req, res) => {
  if (req.file) { var imageName = req.file.filename; }
  const feeddata = req.body.data
  try {
    const userfeed = new Feed({
      name: req.body.name,
      content: feeddata,
      image: imageName,
    })

    userfeed.save();
    res.json({ status: "Image Upload successful!" });
  } catch (error) {
    res.json({ status: "Could not Upload the image!" });
  }
});

// router.get("/get-image", async (req, res) => {
//   try {
//     Images.find({}).then((data) => {
//       res.send({ status: "ok", data: data });
//     });
//   } catch (error) {
//     res.json({ status: error });
//   }
// });


router.get("/get",auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 2; // Adjust the page size as needed
    const skip = (page - 1) * pageSize;
   
    const feeds = await Feed.find({}).skip(skip).limit(pageSize);
    const conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;
    let gfs = Grid(conn.db);
    gfs.collection("uploads");

    const mappedFeeds = await Promise.all(feeds.map(async (feed) => {
      if(!feed.image){
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
    }));

    res.json(mappedFeeds);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    stream.on('error', (error) => reject(error));
  });
}

// like route

router.post("/like", auth, async (req, res) => {
  try {
    const objectIdToFind = req.body._id
    console.log(req.body._id)
    const userfeed = await Feed.findById(objectIdToFind).exec();
    if (userfeed) {
      console.log(userfeed.likes)
      const likes = userfeed.likes
      userfeed.likes = likes + 1;
      userfeed.save()
    }

    res.json({ status: "Image Upload successful!" });
  } catch (error) {

    res.json({ status: "Could not Upload the image!" });
  }
});

module.exports = router;