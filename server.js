const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const db = require("./db");

const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js" });
});

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
// app.put("/users/:id", db.updateUser);
// app.delete("/users/:id", db.deleteUser);

app.get("/posts", db.getAllPosts);

// error handlers
app.use((req, res, next) => {
  const err = new Error("Not Found");
  res.status(404);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
