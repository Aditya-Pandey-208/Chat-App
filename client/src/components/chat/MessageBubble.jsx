function MessageBubble({ msg, socketId }) {
  const isMyMessage = msg.senderId === socketId;

  return (
    <div
      className={`message-row ${
        isMyMessage ? "message-right" : "message-left"
      }`}
    >
      <div
        className={`message-bubble ${
          isMyMessage ? "my-message" : "other-message"
        }`}
      >
        <strong>{msg.username}</strong>
        {msg.message}
        <div>{msg.time}</div>
      </div>
    </div>
  );
}

export default MessageBubble;