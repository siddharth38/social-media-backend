const jwt = require("jsonwebtoken");

//auth
const auth = async (req, res, next) => {
  try {
    //extracting..
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "TOken is missing",
      });
    }
    try {
      const decode = jwt.verify(token, "ajw065123");
      req.user = decode;
    } catch (error) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

module.exports = auth;
//isStudent
