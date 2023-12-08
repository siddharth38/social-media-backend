const {GridFsStorage} = require('multer-gridfs-storage');
const multer = require("multer");
const storage = new GridFsStorage({
    url: process.env.DATABASE,
    file: (req, file) => {
      return {
        filename: file.originalname,
        bucketName: "uploads",
      };
    },
  });
  
  const upload = multer({ storage });

  module.exports = upload;
