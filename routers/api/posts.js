const express = require("express");
const { db } = require("../../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await db("posts")
      .join("users", "posts.author", "=", "users.id")
      .select(
        "posts.title",
        "posts.content",
        "date",
        "users.name as author_name"
      );
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
