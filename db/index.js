const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "mydb.sqlite"),
  },
});

// USERS
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

// POSTS
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

// AUTH
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

// Todo - Доделать
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const createUser = {
      name,
      email,
      password,
    };
    //TODO - Validate (name, email, password)
    //....
    const existingUser = db("users").select("email").where({ email });
    if (existingUser) {
      const error = new Error("This user is alredy created");
      res.status(403).json({ error });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const insertedUser = await db("users").insert({
      name,
      email,
      password: hashedPassword,
    });
    delete insertedUser.password;
    const payload = {
      id: insertedUser.id,
      name,
      email,
    };
    const token = await createToken(payload);
    res.json({
      user: payload,
      token,
    });
  } catch (error) {
    next(error);
  }
};
// Todo - Доделать
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //TODO - Validate (email, password)
    //....
    const user = await db("users")
      .select(["email", "password"])
      .where({ email });
    if (!user.length) {
      return res.status(403).json({ message: "Invalid email" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ message: "Invalid Password" });
    }
    const payload = {
      id: user.id,
      name: user.name,
      email,
    };
    const token = await createToken(payload);
    return res.json({
      user: payload,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Cant signin" });
  }
};
