function Sidebar({
  rooms,
  myRooms,
  room,
  switchRoom,
  deleteRoom,
  setScreen,
}) {
  return (
    <div className="sidebar open">
      <h3>Rooms</h3>

      {/* Other Rooms */}
      {Object.keys(rooms)
        .filter((r) => !myRooms.has(r))
        .map((r) => (
          <div
            key={r}
            className={`room-item ${room === r ? "active-room" : ""}`}
            onClick={() => switchRoom(r)}
          >
            <span>
              {r} ({rooms[r].users})
            </span>
          </div>
        ))}

      {/* My Rooms */}
      {myRooms.size > 0 && (
        <h4 style={{ marginTop: "20px" }}>
          My Rooms 👑
        </h4>
      )}

      {[...myRooms].map((r) => (
        <div
          key={r}
          className={`room-item ${room === r ? "active-room" : ""}`}
          onClick={() => switchRoom(r)}
        >
          <span>
            {r} ({rooms[r]?.users || 0})
          </span>

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

      <button
        className="join-button"
        onClick={() => setScreen("dashboard")}
      >
        + Create Room
      </button>
    </div>
  );
}

export default Sidebar;