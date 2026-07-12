function Dashboard({
  username,
  newRoomName,
  setNewRoomName,
  createRoom,
  error,
}) {
  return (
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

        <button
          className="join-button"
          onClick={createRoom}
        >
          Create Room
        </button>

        <p style={{ marginTop: "15px" }}>
          Or select a room from sidebar →
        </p>
      </div>
    </div>
  );
}

export default Dashboard;