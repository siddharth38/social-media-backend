const isAuthenticated = (req, res, next) => {
  console.log("res from auth : ", re);
  // const token = req.cookies["connect.sid"];
  // const token = req.cookies["https://besthealing.baavlibuch.com"];

  console.log("res from auth : ", res);
  const token = req.cookies["connect.sid"];


  if (!token) {
    return res.status(401).json({
      success: false,
      message: "TOken is missing",
    });
  }
  next();
};

module.exports = isAuthenticated;
