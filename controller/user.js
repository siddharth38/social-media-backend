const jwt = require("jsonwebtoken");

const myProfile = (req, res, next) => {
  console.log(req.user);
  const token = jwt.sign(
    { name: req.user.name, userId: req.user._id },
    "ajw065123",
    {
      expiresIn: "1h",
    }
  );
  res.status(200).json({
    success: true,
    user: req.user,
    token,
  });
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    res.status(200).json({
      message: "Logged Out",
    });
  });
};

module.exports = {
  myProfile,
  logout,
};
