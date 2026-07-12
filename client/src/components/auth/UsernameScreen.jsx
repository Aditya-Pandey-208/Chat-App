import { socket } from "../../services/socket";

function UsernameScreen({
  username,
  setUsername,
  error,
  setError,
  setScreen,
}) {
  
    const handleContinue = () => {
        socket.emit("validate_username", username);
    };

  return (
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
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default UsernameScreen;