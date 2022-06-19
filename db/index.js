const path = require("path");
const db = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "mydb.sqlite"),
  },
});

exports.getUsers = async (req, res) => {
  try {
    const data = await db("users").select(["id", "name"]);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;
    await db("users").insert({ name });
    res.status(201).json({ message: `User was created` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const data = await db("users").where({ id: userId }).select(["id", "name"]);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.getAllPosts = async (req, res) => {
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
};
