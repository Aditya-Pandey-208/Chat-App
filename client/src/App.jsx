import { useEffect, useRef, useState } from "react";

import "./App.css";

import UsernameScreen from "./components/auth/UsernameScreen";
import ChatWindow from "./components/chat/ChatWindow";
import Dashboard from "./components/rooms/Dashboard";
import Sidebar from "./components/rooms/Sidebar";

import { socket } from "./services/socket";

const SCREENS = {
  USERNAME: "username",
  DASHBOARD: "dashboard",
  CHAT: "chat",
};

function App() {

  // USER
  const [username, setUsername] = useState("");
  const [socketId, setSocketId] = useState("");

  // NAVIGATION
  const [screen, setScreen] = useState(SCREENS.USERNAME);
  const [room, setRoom] = useState("");

  // CHAT
  const [messages, setMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");

  // ROOMS
  const [rooms, setRooms] = useState({});
  const [myRooms, setMyRooms] = useState(new Set());
  const [newRoomName, setNewRoomName] = useState("");

  // UI
  const [error, setError] = useState("");

  // REFS
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const usernameRef = useRef("");
  const roomRef = useRef("");

  // SOCKET LISTENERS

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => ({
        ...prev,
        [data.room]: [...(prev[data.room] || []), data],
      }));
    });

    socket.on("rooms_list", (serverRooms) => {
      setRooms(serverRooms);

      // Synchronize myRooms by removing keys that no longer exist on the server
      setMyRooms((prevMyRooms) => {
        const updated = new Set(prevMyRooms);
        for (const roomName of updated) {
          if (!serverRooms[roomName]) {
            updated.delete(roomName);
          }
        }
        return updated;
      });
    });

    socket.on("room_deleted", (deletedRoom) => {
      if (deletedRoom === roomRef.current) {
        setRoom("");
        setScreen(SCREENS.DASHBOARD);
      }

      setMyRooms((prev) => {
        const updated = new Set(prev);
        updated.delete(deletedRoom);
        return updated;
      });
    });

    socket.on("username_valid", () => {
      setError("");
      setScreen(SCREENS.DASHBOARD);
    });

    socket.on("username_error", (message) => {
      setError(message);
    });

    socket.on("room_created", (roomName) => {
      setMyRooms((prev) => {
        const updated = new Set(prev);
        updated.add(roomName);
        return updated;
      });

      setNewRoomName("");

      socket.emit("join_room", {
        room: roomName,
      });

      setRoom(roomName);
      setScreen(SCREENS.CHAT);
    });

    socket.on("room_error", (message) => {
      setError(message);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("rooms_list");
      socket.off("room_deleted");
      socket.off("username_valid");
      socket.off("username_error");
      socket.off("room_created");
      socket.off("room_error");
    };
  }, []);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  // AUTO SCROLL

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, room]);

  // ROOM FUNCTIONS

  const switchRoom = (newRoom) => {
    if (!username) {
      setError("Enter username first");
      return;
    }

    if (room === newRoom) return;

    socket.emit("join_room", {
      room: newRoom,
    });

    setRoom(newRoom);
    setScreen(SCREENS.CHAT);
  };

  const createRoom = () => {
    if (!newRoomName.trim()) {
      setError("Enter room name");
      return;
    }

    socket.emit("create_room", {
      room: newRoomName,
    });
  };

  const deleteRoom = (roomName) => {
    if (!rooms[roomName]) {
      setError("Room no longer exists");
      return;
    }

    socket.emit("delete_room", {
      room: roomName,
      username,
    });
  };

  // CHAT FUNCTIONS

  const sendMessage = () => {
    if (!currentMessage.trim()) {
      return;
    }

    socket.emit("send_message", {
      room,
      username,
      message: currentMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setCurrentMessage("");
  };

  // RENDER

  return (
    <div className="app-container">
      {screen !== SCREENS.USERNAME && (
        <Sidebar
          rooms={rooms}
          myRooms={myRooms}
          room={room}
          switchRoom={switchRoom}
          deleteRoom={deleteRoom}
          setScreen={setScreen}
        />
      )}

      <div className="chat-container">
        {screen === SCREENS.USERNAME && (
          <UsernameScreen
            username={username}
            setUsername={setUsername}
            error={error}
            setError={setError}
            setScreen={setScreen}
          />
        )}

        {screen === SCREENS.DASHBOARD && (
          <Dashboard
            username={username}
            newRoomName={newRoomName}
            setNewRoomName={setNewRoomName}
            createRoom={createRoom}
            error={error}
          />
        )}

        {screen === SCREENS.CHAT && (
          <ChatWindow
            room={room}
            messages={messages}
            socketId={socketId}
            messagesEndRef={messagesEndRef}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            sendMessage={sendMessage}
            inputRef={inputRef}
          />
        )}
      </div>
    </div>
  );
}

export default App;