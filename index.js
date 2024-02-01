require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Login = require("./routes/auth");
const upload = require("./routes/uploads");
const follow = require("./routes/follow");
const profile = require("./routes/profile");
const chat = require("./routes/chat");
const { connectToDatabase, connection } = require("./config/db");
const PORT = process.env.PORT || 3000;
const socket = require("socket.io");
const doctorRanks = require("./utils/pagerank");
const bodyParser = require("body-parser");
const question = require("./routes/question");
const connectPassport = require("./utils/Provider");
const session = require("express-session");
const passport = require("passport");
const cookieparser = require("cookie-parser");
const logout = require("./routes/auth");
const app = express();

connectToDatabase().then(() => {
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  //creating a middleware for session for googel auth

  const corsOptions = {
    origin: "*", // Replace with your front-end origin
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(
    session({
      secret: "ajw065123",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(cookieparser());
  app.use(passport.authenticate("session"));
  app.use(passport.initialize());
  app.use(passport.session());

  connectPassport();
  app.use("/auth", Login);
  // app.use("/auth", logout);
  app.use("/feed", upload);
  app.use("/follow", follow);
  app.use("/chat", chat);
  app.use("/profile", profile);
  app.use("/qna", question);
  const server = app.listen(PORT, () => {
    console.log(`Server start at port no ${PORT}`);
  });

  console.log("Doctor Ranks:", doctorRanks);
  const io = socket(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
    maxHttpBufferSize: 1e8,
    pingTimeout: 60000,
  });

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      global.onlineUsers.set(userId, socket.id);
      console.log(`${userId} is online`);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = global.onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data);
      }
    });
  });
});
