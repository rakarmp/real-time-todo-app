const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// to-do list data
const todoList = [];

// socket io logic
io.on("connection", (socket) => {
  console.log("A user connected");

  // send initial to-do list data to the connected client
  socket.emit("todoList", todoList);

  // Handle new to-do item
  socket.on("addTodo", (newTodo) => {
    todoList.push(newTodo);
    io.emit("todoList", todoList);
  });

  // Handle completed to-do item
  socket.on("toggleComplete", (index) => {
    todoList[index].completed = !todoList[index].completed;
    io.emit("todoList", todoList);
  });

  // Handle deleted to-do item
  socket.on("deleteTodo", (index) => {
    todoList.splice(index, 1);
    io.emit("todoList", todoList);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
