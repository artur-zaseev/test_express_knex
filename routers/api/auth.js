const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { db } = require("../../db");

const router = express.Router();

router.get("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Missing username and/or password" });
  }

  try {
    // Check for existing user
    const user = db("users").select("id").where({ name: username });

    if (user.length)
      return res
        .status(400)
        .json({ success: false, message: "User already taken" });

    // hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      username,
      password: hashedPassword,
    };

    // Save user
    db("users").insert(newUser);

    // Create token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    function createToken(payload) {
      return new Promise((resolve, reject) => {
        jwt.sign(
          payload,
          "XXXXXXXXXXXXXX-SUPER-SECRET", // TODO - get it fron env
          { expiresIn: "1d" },
          (error, token) => {
            if (error) return reject(error);
            return resolve(token);
          }
        );
      });
    }

    // Response
    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post("/signin", async (req, res) => {
  try {
    res.status(200).json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
