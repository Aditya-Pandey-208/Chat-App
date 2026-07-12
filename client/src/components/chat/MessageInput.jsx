function MessageInput({
  currentMessage,
  setCurrentMessage,
  sendMessage,
  inputRef,
}) {
  return (
    <div className="input-bar">
      <input
        ref={inputRef}
        className="input-box"
        placeholder="Type a message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      <button className="send-btn" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;