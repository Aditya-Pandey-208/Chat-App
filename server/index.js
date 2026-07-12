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

const rooms = {};
const activeUsers = new Map();
const usernames = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("rooms_list", rooms);

  socket.on("validate_username", (username) => {
    username = username.trim();

    if (!username) {
      socket.emit("username_error", "Username cannot be empty.");
      return;
    }

    if (username.length < 3) {
      socket.emit("username_error", "Username must be at least 3 characters.");
      return;
    }

    if (username.length > 20) {
      socket.emit("username_error", "Username cannot exceed 20 characters.");
      return;
    }

    if (usernames.has(username)) {
      socket.emit("username_error", "Username already taken.");
      return;
    }

    activeUsers.set(socket.id, username);
    usernames.set(username, socket.id);

    socket.emit("username_valid", username);
  });

  
  socket.on("create_room", async ({ room }) => {
    const username = activeUsers.get(socket.id);
    room = room.trim();

    if (!room) {
      socket.emit("room_error", "Room name cannot be empty.");
      return;
    }

    if (room.length < 3) {
      socket.emit("room_error", "Room name must be at least 3 characters.");
      return;
    }

    if (room.length > 30) {
      socket.emit("room_error", "Room name cannot exceed 30 characters.");
      return;
    }

    if (rooms[room]) {
      socket.emit("room_error", "Room already exists.");
      return;
    }

    const currentRoom = [...socket.rooms].find(
      (joinedRoom) => joinedRoom !== socket.id
    );

    if (currentRoom) {
      if (rooms[currentRoom]) {
        rooms[currentRoom].users--;

        if (rooms[currentRoom].users <= 0) {
            delete rooms[currentRoom];
        }
      }

      await socket.leave(currentRoom);
    }

    rooms[room] = {
      users: 0,
      createdBy: username,
    };

    await socket.join(room);
    rooms[room].users++;

    io.emit("rooms_list", rooms);
    socket.emit("room_created", room);
  });

  socket.on("join_room", async ({ room }) => {
    const username = activeUsers.get(socket.id);
    room = room.trim();

    if (!rooms[room]) {
      socket.emit("room_error", "Room does not exist.");
      return;
    }

    const currentRoom = [...socket.rooms].find(
      (joinedRoom) => joinedRoom !== socket.id
    );

    if (currentRoom && currentRoom !== room) {
      if (rooms[currentRoom]) {
        rooms[currentRoom].users--;
        
        if (rooms[currentRoom].users <= 0) {
          delete rooms[currentRoom];
        }
      }
      await socket.leave(currentRoom);
    }

    if (socket.rooms.has(room)) return;

    rooms[room].users++;
    await socket.join(room);

    io.emit("rooms_list", rooms);
  });

  socket.on("leave_room", async (room) => {
    if (rooms[room]) {
      rooms[room].users--;

      if (rooms[room].users <= 0) {
        delete rooms[room];
      }
    }

    await socket.leave(room);
    io.emit("rooms_list", rooms);
  });

  socket.on("send_message", (data) => {
    const messageData = {
      room: data.room,
      username: data.username,
      message: data.message,
      time: data.time,
      senderId: socket.id,
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
    const username = activeUsers.get(socket.id);

    if (username) {
      usernames.delete(username);
      activeUsers.delete(socket.id);
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
}); 