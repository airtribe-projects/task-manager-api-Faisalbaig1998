// const express = require('express');
// const app = express();
// const port = 3000;


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.listen(port, (err) => {
//     if (err) {
//         return console.log('Something bad happened', err);
//     }
//     console.log(`Server is listening on ${port}`);
// });



// module.exports = app;

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Load tasks from task.json
const dataPath = path.join(__dirname, "task.json");
const rawData = fs.readFileSync(dataPath);
const parsedData = JSON.parse(rawData);

let tasks = parsedData.tasks;

// Helper: validate task body
function isValidTask(body) {
  return (
    body &&
    typeof body.title === "string" &&
    typeof body.description === "string" &&
    typeof body.completed === "boolean"
  );
}

// GET /tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({});
  }

  res.status(200).json(task);
});

// POST /tasks
app.post("/tasks", (req, res) => {
  if (!isValidTask(req.body)) {
    return res.status(400).json({});
  }

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({});
  }

  if (!isValidTask(req.body)) {
    return res.status(400).json({});
  }

  tasks[index] = { id, ...req.body };
  res.status(200).json(tasks[index]);
});

// DELETE /tasks/:id
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({});
  }

  const deleted = tasks.splice(index, 1)[0];
  res.status(200).json(deleted);
});

// Start server (required for tests)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

module.exports = app;
