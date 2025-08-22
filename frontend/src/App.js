import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  const login = () => {
    if (password.trim()) setIsAuthed(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        password,
      }),
    });

    const data = await response.json();
    if (data.choices) {
      const reply = data.choices[0].message;
      setMessages((prev) => [...prev, reply]);
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: " + data.error }]);
    }
    setInput("");
  };

  if (!isAuthed) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Password Required</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Enter</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Chat with GPT</h2>
      <div style={{ border: "1px solid #ccc", height: 400, overflowY: "scroll", padding: 10 }}>
        {messages.map((msg, i) => (
          <p key={i}><b>{msg.role}:</b> {msg.content}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
