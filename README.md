# 💬 Chat App

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)

Chat App is a full-stack real-time messaging application built with **React**, **Node.js**, **Express**, and **Socket.IO**.

It demonstrates how WebSockets enable instant communication between multiple users, room-based messaging, and synchronized updates across connected clients.

---

# 💡 Why Chat App?

This project was built to understand real-time communication beyond traditional REST APIs. It focuses on event-driven architecture, room management, and scalable Socket.IO communication while maintaining a clean React component structure.

---

# ✨ Features

* 👤 Username validation
* 🏠 Create chat rooms
* 🚪 Join existing rooms
* 🔄 Automatic room switching
* 💬 Real-time messaging
* 🗑️ Creator-only room deletion
* 📋 Live room synchronization
* ⚡ Instant UI updates
* 📱 Responsive interface

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* CSS
* Socket.IO Client

## Backend

* Node.js
* Express
* Socket.IO

---

# 🏗 Architecture

```text
          React + Vite
               │
               │ Socket.IO
               ▼
     Express + Socket.IO Server
               │
        In-Memory Room Storage
```

---

# 📂 Project Structure

```text
Chat-App/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── index.js
│   └── package.json
└── README.md
```

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/Aditya-Pandey-208/Chat-App.git
cd Chat-App
```

## Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

## Run Backend

```bash
cd server
node index.js
```

Backend: `http://localhost:3000`

## Run Frontend

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`

---

# 🔄 Socket.IO Events

| Client → Server | Purpose |
|---|---|
| validate_username | Validate username |
| create_room | Create room |
| join_room | Join room |
| leave_room | Leave room |
| send_message | Send message |
| delete_room | Delete room |

| Server → Client | Purpose |
|---|---|
| username_valid | Username accepted |
| username_error | Username rejected |
| room_created | Room created |
| room_error | Room error |
| rooms_list | Sync room list |
| receive_message | Receive message |
| room_deleted | Room deleted |

---

# 📈 Current Features

- Username validation
- Create / Join / Switch rooms
- Creator-only room deletion
- Live room updates
- Real-time messaging

---

# 🎯 Roadmap

- Public & Private Rooms
- Password Protected Rooms
- Typing Indicator
- Online Users
- Database Persistence
- Emoji Support
- Dark Mode

---

# 🤝 Contributing

Contributions, feature suggestions, and bug reports are welcome.

---

# 👨‍💻 Author

**Aditya Pandey**

Built with ❤️ using React, Node.js, Express, and Socket.IO.
