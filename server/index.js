const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ username, room }) => {
    if (!rooms[room]) {
      rooms[room] = {
        users: 0,
        createdBy: username,
      };
    }

    // prevent duplicate join
    if (socket.rooms.has(room)) return;

    rooms[room].users++;
    socket.join(room);

    console.log(`${username} joined room: ${room}`);
    io.emit("rooms_list", rooms);
  });

  socket.on("leave_room", (room) => {
    if (rooms[room]) {
      rooms[room].users--;

      if (rooms[room].users <= 0) {
        delete rooms[room];
      }
    }

    socket.leave(room);
    io.emit("rooms_list", rooms);
  });

  socket.on("send_message", (data) => {
    const messageData = {
      room: data.room,
      username: data.username,
      message: data.message,
      time: data.time,
      senderId: socket.id, // keep this (used for message alignment if needed)
    };

    io.to(data.room).emit("receive_message", messageData);
  });

  socket.on("delete_room", ({ room, username }) => {
    if (rooms[room] && rooms[room].createdBy === username) {
      console.log("Room deleted:", room);

      delete rooms[room];

      io.emit("rooms_list", rooms);

      io.to(room).emit("room_deleted", room);
    } else {
      console.log("Delete denied: not creator");
    }
  });

  socket.on("disconnecting", () => {
    const joinedRooms = [...socket.rooms];

    joinedRooms.forEach((room) => {
      if (rooms[room]) {
        rooms[room].users--;

        if (rooms[room].users <= 0) {
          delete rooms[room];
        }
      }
    });

    io.emit("rooms_list", rooms);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});