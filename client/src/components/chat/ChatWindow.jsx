import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

function ChatWindow({
  room,
  messages,
  socketId,
  messagesEndRef,
  currentMessage,
  setCurrentMessage,
  sendMessage,
  inputRef,
}) {
  return (
    <>
      <div className="header">
        <h2>Room: {room}</h2>
      </div>

      <div className="messages">
        {(messages[room] || []).map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            socketId={socketId}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        sendMessage={sendMessage}
        inputRef={inputRef}
      />
    </>
  );
}

export default ChatWindow;