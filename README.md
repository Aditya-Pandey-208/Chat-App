# Chat App 

This is a real-time chat application built using React and Node.js with Socket.IO.

The main idea was to understand how real-time communication works and how multiple users can interact in different rooms.

---

##  What it can do

- Users can enter a username and join the app
- Create a new room or join an existing one
- Send messages in real time
- Switch between rooms
- Delete rooms (only if you created them)

---

##  Tech used

- React (Frontend)
- Node.js + Express (Backend)
- Socket.IO (Real-time communication)

---

##  How to run

1. Clone the project
git clone https://github.com/YOUR_USERNAME/Chat-App.git

cd Chat-App

2. Install dependencies


cd client
npm install

cd ../server
npm install


3. Run the project

backend

cd server
node index.js

frontend

cd client
npm run dev


---

##  Note

`node_modules` is not included in the repo.  
Run `npm install` in both folders to set up dependencies.

---

##  What I learned

- How Socket.IO works for real-time apps
- Managing rooms and users
- Handling UI updates based on events

---

##  Future improvements

- Add authentication
- Save messages (database)
- Private rooms with passwords

---

Made as a learning project.