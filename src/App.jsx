import { useState } from "react";
import "./index.css";
import ChatWindow from "./components/chat-window";

function App() {
  const [count, setCount] = useState(0);

  return <ChatWindow />;
}

export default App;
