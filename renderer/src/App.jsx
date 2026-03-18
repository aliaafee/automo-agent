import { useState, useEffect } from "react";
import ChatWindow from "./components/chat-window.jsx";

function App() {
    const [ping, setPing] = useState("");

    useEffect(() => {
        window.versions.ping().then(setPing);
    }, []);

    return <ChatWindow />;
}

export default App;
