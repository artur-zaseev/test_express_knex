const express = require("express");

// Routes
const usersRouter = require("./routers/api/users");
const postsRouter = require("./routers/api/posts");

// start app
const app = express();
app.use(express.json());

// Use
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);

app.listen(3000, () => console.log(`App running on port 3000.`));
