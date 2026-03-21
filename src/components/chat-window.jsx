import { useState } from "react";
import ChatMessages from "./chat-messages";

function ChatWindow() {
    const [count, setCount] = useState(0);
    const [messages, setMessages] = useState([
        { id: 1, type: "incoming", body: { text: "Hello!" } },
        { id: 2, type: "outgoing", body: { text: "Hello Back!" } },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = () => {
        if (inputValue.trim() === "") return;
        const newMessage = {
            id: Date.now(),
            type: "outgoing",
            body: { text: inputValue },
        };
        setMessages([...messages, newMessage]);
        setInputValue("");
        setIsLoading(true);

        // Simulate an incoming message after a delay
        setTimeout(() => {
            const incomingMessage = {
                id: Date.now() + 1,
                type: "incoming",
                body: { text: "This is an automated response." },
            };
            setMessages((prevMessages) => [...prevMessages, incomingMessage]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="h-screen flex flex-col bg-blue-300 text-sm">
            <div className="bg-gray-200 px-2 py-4">AutoMO Chat</div>
            <ChatMessages
                messages={messages}
                isLoading={isLoading}
                className="grow"
            />

            <div className="bg-gray-200 px-2 py-2 flex gap-2">
                <textarea
                    className="w-full px-2 py-1 rounded-lg outline-0 border border-gray-400 focus:border-blue-500 resize-none bg-white"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                />

                <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatWindow;
