import express from "express";

const app = express();

const PORT = 3000;

app.use(express.json());

let userData = [];
let nextId = 1;

// Now we building a CRUD part

// add a new user
app.post("/users", (req, res) => {
  console.log("POST");
  const { name, designation } = req.body;
  const newUser = {
    id: nextId++,
    name,
    designation,
  };
  userData.push(newUser);
  res.status(201).send(newUser);
});

// get all users
app.get("/users", (req, res) => {
  res.status(200).send(userData);
});

// get a user with id
app.get("/users/:id", (req, res) => {
  const user = userData.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.status(200).send(user);
});

// update user

app.put("/users/:id", (req, res) => {
  const user = userData.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("User not found");
  }
  const { name, designation } = req.body;
  user.name = name;
  user.designation = designation;
  res.status(200).send(user);
});

// delete user
app.delete("/users/:id", (req, res) => {
  console.log("delete");
  console.log(req.params.id);

  const index = userData.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("User not found");
  }
  userData.splice(index, 1);
  return res.status(204).send(deleted);
});

/*
NOTE: when you run above code you can just go in postman and click the new and then you can just cleck POST  nad then write url like 127.0.0.1/users and then you can see the options below select the body inside that you select the raw and then select JSON(application/json) and then write the data like
{
    "name": "Lily",
    "designation": "developer" 
} click send and you can see the response like
{
    "id": 1,
    "name": "Lily",
    "designation": "developer"
}
*/

// app.get("/", (req, res) => {
//   res.send("Hello, Express!");
// });

// app.get("/user-express", (req, res) => {
//   res.send("Hello, User-Express!");
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/*
steps to how to run express.js
1. create folder like 02_express
2. In that folder run command "npm init"
3. It gives some questions, answer them like
    package name: (02_express) express-manager
    version: (1.0.0)
    description: a simple manager for to learn express
    entry point: (index.js)                            
    test command:                                      
    git repository:                                    
    keywords: express
    author: saniya
    license: (ISC)     
4. click enter and After that it creates a package.json file and then
 go to pagage.json file and see the "test" script is there and
chage with "start" and add "type": "module" in the file
next step is to install "npm install express" in the terminal
5. if you don't want to run again and again you can type command "npm i -D nodemon" and also add in package.json file loke "dev": nodemon index.js
*/
