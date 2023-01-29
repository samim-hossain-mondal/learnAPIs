const express = require('express');
const server = express();
const PORT = 3000;

server.use(express.json());

let tasks = [{ id: 0, taskName: 'demo', isComplete: true }];

const getTask = (req, res) => {
  res.send(tasks);
};

const getTaskById = (req, res, id) => {
  try {
    res.statusCode(200);
    res.send(tasks[id]);
  }
  catch {
    res.statusCode(400);
  }
};

const addTask = (req, res) => {
  let task = req.body;
  if (task.id === undefined) {
    task.id = 1 + Number(tasks[tasks.length - 1].id);
  }
  if (task.isComplete === undefined) {
    task.isComplete = false;
  }
  tasks.push(task);
  res.send(tasks);
};

const changeCompleteStatus = (req, res) => {
  let task = req.body;
  tasks = tasks.reduce((acc, cuu) => {
    if (cuu.id === task.id) {
      cuu.taskName = task.taskName;
      cuu.isComplete = task.isComplete;
    }
    return [...acc, cuu];
  }, []);
  res.send(tasks);
};

const deleteTask = (req, res, id) => {
  tasks = tasks.filter(item => item.id != id);
  res.send(tasks);
};

const deleteAll = (req, res) => {
  tasks.splice(0, tasks.length);
  res.send(tasks);
};

// ............serving..............

server.get('/', (req, res) => {
  res.send('Todos API --- To View List of Tasks visit /tasks');
});

server.get('/tasks', (req, res) => {
  getTask(req, res);
});

server.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  getTaskById(req, res, id);
});

server.post('/tasks', (req, res) => {
  addTask(req, res);
});

server.put('/tasks', (req, res) => {
  changeCompleteStatus(req, res);
});

server.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  deleteTask(req, res, id);
});

server.delete('/tasks', (req, res) => {
  deleteAll(req, res);
});

server.listen(`${PORT}`);