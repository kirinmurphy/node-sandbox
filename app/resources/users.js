const resourceRouter = require("../utils/resourceRouter");

// app/resources/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../utils/resourceRouter/connection");
const { setAuthCookies } = require("../middlewares/auth");

const userResource = resourceRouter({
  tableName: "users",
  tableColumns: `(
    id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    PRIMARY KEY (id)
  )`,
  requiredFields: ["username", "email", "password"],
  optionalFields: ["created_at", "updated_at"],
});

const { router } = userResource;

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    connection.query(
      query,
      [username, email, hashedPassword],
      (err, results) => {
        console.log("ERRRRR", err, results);
        if (err) {
          // TEST: NOT WORKING
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              success: false,
              message: "Username or email already exists.",
            });
          }

          return res.json({
            success: false,
            message: "Signup failed dude: " + err + ", " + results,
          });
        } else {
          setAuthCookies({ res, userId: results.insertId });
          return res.json({ success: true });
        }
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ success: false, message: "Signup failed due to server error" });
  }
});
router.post("/login", (req, res) => {
  const { emailOrUsername, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  connection.query(
    query,
    [emailOrUsername, emailOrUsername],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false, message: "Login failed." });
      } else {
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          setAuthCookies({ res, userId: user.id });
          return res.json({ success: true });
        } else {
          return res.json({ success: false, message: "Login failed." });
        }
      }
    }
  );
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ success: true });
});

module.exports = userResource;
