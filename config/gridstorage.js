const {GridFsStorage} = require('multer-gridfs-storage');
const multer = require("multer");
const storage = new GridFsStorage({
    url: "mongodb+srv://siddharthkumar28717:ajw065123@cluster0.9zd0gig.mongodb.net/?retryWrites=true&w=majority",
    file: (req, file) => {
      return {
        filename: file.originalname,
        bucketName: "uploads",
      };
    },
  });
  
  const upload = multer({ storage });

  module.exports = upload;
