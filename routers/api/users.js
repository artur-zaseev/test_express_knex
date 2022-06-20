const express = require("express");
const { db } = require("../../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await db("users").select(["id", "name"]);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    await db("users").insert({ name });
    res.status(201).json({ message: `User was created` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const data = await db("users").where({ id: userId }).select(["id", "name"]);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
