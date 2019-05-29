const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

server.express.use(cookieParser());

// Express middleware to handle JSON WEB TOKEN
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

// Express middleware to populate current user

server.start(
  // {
  //   cors: {
  //     credentials: true,
  //     origin: process.env.FRONTEND_URL
  //   }
  // },
  deets => {
    console.log(`Server is running on port http:/localhost:${deets.port}`);
  }
);
