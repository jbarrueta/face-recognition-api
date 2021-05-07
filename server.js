const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

const database = {
  users: [
    {
      id: "123",
      name: "John Appleseed",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  bcrypt.compare(
    "apple",
    "$2a$10$QEnuM2Sq5ZqKod2xycIQuOZKa8hNIUZV49BlqAm4fcitS1rKEgQNK",
    (err, res) => {
      console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$QEnuM2Sq5ZqKod2xycIQuOZKa8hNIUZV49BlqAm4fcitS1rKEgQNK",
    (err, res) => {
      console.log("first guess", res);
    }
  );
  const user = database.users.find((user) => user.email === req.body.email);
  if (user !== undefined && passwordMatch(user.password, req.body.password)) {
    res.json(database.users[0]);
  } else if (user === undefined) {
    res.status(400).json("Email was not found please register");
  } else {
    res.status(400).json("Credentials were incorrect");
  }
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  const encryptedP = bcrypt.hashSync(password);
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: encryptedP,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("Not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("Not found");
  }
});

app.listen(50001, () => {
  console.log("App is running on port 50001");
});

const passwordMatch = (savedPassword, inputPassword) => {
  return bcrypt.compareSync(inputPassword, savedPassword);
};

/*

/ --> res = this is working
/signin --> POST success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = update user

*/
