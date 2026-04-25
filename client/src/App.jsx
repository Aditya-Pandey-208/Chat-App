import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [screen, setScreen] = useState("username");
  const [socketId, setSocketId] = useState("");
  const [error, setError] = useState("");

  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [rooms, setRooms] = useState({});
  const [newRoomName, setNewRoomName] = useState("");
  const [myRooms, setMyRooms] = useState(new Set());

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

    socket.on("rooms_list", (data) => {
      setRooms(data);
    });

    socket.on("room_deleted", (deletedRoom) => {
      if (deletedRoom === room) {
        setRoom("");
        setScreen("dashboard");
      }

      setMyRooms((prev) => {
        const updated = new Set(prev);
        updated.delete(deletedRoom);
        return updated;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("rooms_list");
      socket.off("room_deleted");
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, room]);

  const switchRoom = (newRoom) => {
    if (!username) {
      setError("Enter username first");
      return;
    }

    if (room) socket.emit("leave_room", room);

    socket.emit("join_room", { username, room: newRoom });

    setRoom(newRoom);
    setScreen("chat");
  };

  const createRoom = () => {
    if (!newRoomName.trim()) {
      setError("Enter room name");
      return;
    }

    if (room) socket.emit("leave_room", room);

    socket.emit("join_room", { username, room: newRoomName });

    setMyRooms((prev) => {
      const updated = new Set(prev);
      updated.add(newRoomName);
      return updated;
    });

    setRoom(newRoomName);
    setNewRoomName("");
    setScreen("chat");
  };

  const deleteRoom = (r) => {
    if (!rooms[r]) {
      setError("Room no longer exists");
      return;
    }

    socket.emit("delete_room", { room: r, username });
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

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

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      {screen !== "username" && (
        <div className="sidebar open">
          <h3>Rooms</h3>

          {/* OTHER ROOMS */}
          {Object.keys(rooms)
            .filter((r) => !myRooms.has(r))
            .map((r) => (
              <div
                key={r}
                className={`room-item ${room === r ? "active-room" : ""}`}
                onClick={() => switchRoom(r)}
              >
                <span>{r} ({rooms[r].users})</span>
              </div>
          ))}

          {/* MY ROOMS */}
          {myRooms.size > 0 && (
            <h4 style={{ marginTop: "20px" }}>My Rooms 👑</h4>
          )}

          {[...myRooms].map((r) => (
            <div
              key={r}
              className={`room-item ${room === r ? "active-room" : ""}`}
              onClick={() => switchRoom(r)}
            >
              <span>{r} ({rooms[r]?.users || 0})</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRoom(r);
                }}
              >
                ❌
              </button>
            </div>
          ))}

          <button className="join-button" onClick={() => setScreen("dashboard")}>
            + Create Room
          </button>
        </div>
      )}

      <div className="chat-container">

        {/* USERNAME */}
        {screen === "username" && (
          <div className="join-container">
            <div className="join-card">
              <h1>Enter Username</h1>

              <input
                className="join-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {error && <p className="error-text">{error}</p>}

              <button
                className="join-button"
                onClick={() => {
                  if (!username) {
                    setError("Enter username");
                    return;
                  }
                  setError("");
                  setScreen("dashboard");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {screen === "dashboard" && (
          <div className="join-container">
            <div className="join-card">
              <h1>Welcome, {username}</h1>

              <input
                className="join-input"
                placeholder="Enter room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />

              {error && <p className="error-text">{error}</p>}

              <button className="join-button" onClick={createRoom}>
                Create Room
              </button>

              <p style={{ marginTop: "15px" }}>
                Or select a room from sidebar →
              </p>
            </div>
          </div>
        )}

        {/* CHAT */}
        {screen === "chat" && (
          <>
            <div className="header">
              <h2>Room: {room}</h2>
            </div>

            <div className="messages">
              {(messages[room] || []).map((msg, i) => (
                <div
                  key={i}
                  className={`message-row ${
                    msg.username === username
                      ? "message-right"
                      : "message-left"
                  }`}
                >
                  <div
                    className={`message-bubble ${
                      msg.username === username
                        ? "my-message"
                        : "other-message"
                    }`}
                  >
                    <strong>{msg.username}</strong>
                    {msg.message}
                    <div>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-bar">
              <input
                ref={inputRef}
                className="input-box"
                placeholder="Type a message..."  // 🔥 FIXED
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
              />

              <button className="send-btn" onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;