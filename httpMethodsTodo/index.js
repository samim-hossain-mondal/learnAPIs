const http = require('http')
const url = require('url')

let tasks = [{ id: "0", taskName: "demo", isCompleted: "null" }];
let id = 0;

const getTask = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(tasks))
    res.end()
}

const getTaskById = (req, res, id) => {
    try {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(tasks[id]))
    }
    catch {
        res.writeHead(400)
    }
    finally {
        res.end()
    }
}

const addTask = (req, res) => {
    let body = "";
    req.on("data", chunk => {
        body += chunk.toString()
    })
    req.on("end", () => {
        tasks.push(JSON.parse(body))
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(body))
        res.end()
    })
}

const changeTaskStatus = (req, res, id) => {
    tasks[id].isCompleted = 1;
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(tasks[id]))
    res.end()
}

const deleteTask = (req, res, iD) => {
    tasks = tasks.filter((item) => {
        return item.id != iD;
    });
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(tasks))
    res.end()
}

http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/tasks') {
        getTask(req, res);
    }
    else if (req.method === 'GET' && req.url.match(/[/]tasks[/][0-9]+/)) {
        const matched = req.url.match(/[0-9]+/);
        const id = Number(matched[0]);
        getTaskById(req, res, id);
    }
    else if (req.method === 'POST' && req.url === '/tasks') {
        addTask(req, res);
    }
    else if (req.method === 'PUT' && req.url.match(/[/]tasks[/][0-9]+/)) {
        const matched = req.url.match(/[0-9]+/);
        const id = Number(matched[0]);
        changeTaskStatus(req, res, id);
    }
    else if (req.method === 'DELETE' && req.url.match(/[/]tasks[/][0-9]+/)) {
        const matched = req.url.match(/[0-9]+/);
        const id = Number(matched[0]);
        deleteTask(req, res, id);
    }

}).listen(8000)