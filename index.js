const express = require("express");
const app = express();
const PORT = 3000;



//basic route
app.get("/", (req, res) => {
  res.send("Hello, Express!, welcome to my server!");
}
);
//middlewares
app.use(express.json());
  app.use((req,res,next) => {
console.log(`${req.method} ${req.url}`);
next();
});
//routes
app.get("/about", (req, res) => {
  res.send("This is the about page");
});

app.post("contact", (req, res) => {
  res.send("This is the contact page");
});
//route parameters
app.get("user/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User ID is ${userId}`);
});
//query parameters
app.get("/search", (req, res) => {
  const query = req.query.q;
  res.send(`Search results for: ${query}`);
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// });


//REST API
let users= [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" }
];
// CRUD operations
//create
app.post("/users", (req, res) => {
  const newUser={id: users.length + 1, name: req.body.name};

  users.push(newUser);
  res.status(201).json(newUser);
});

//read
app.get("/users", (req,res) => {
  res.json(users);
})
// read one 
app.get("/users/:id", (req,res) => {
  const user= users.find(u => u.id === Number(req.params.id));
  res.json(user);
})

//update
app.put("user/:id", (req,res) =>{
  const user= users.find(u= u.id ===Number(req.params.id));
  user.name= req.body.name;
  res.json(user);
})
