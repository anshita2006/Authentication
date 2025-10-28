const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = "mysecretkey123";

const user = {
  id: 1,
  username: "testuser",
  password: "password123",
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  jwt.verify(token, SECRET_KEY, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = userData;
    next();
  });
}

app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user,
  });
});

app.get("/", (req, res) => {
  res.send("✅ Server is running! Use /login to get a token or /protected to test authentication.");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
