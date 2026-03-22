import { useEffect, useState } from "react";
import ChatMessages from "./chat-messages";
import { DEFAULT_CONFIG } from "../llm";

function ChatWindow() {
    const [llmConfig, setLlmConfig] = useState({});
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        // Fetch default LLM config from main process on mount
        (async () => {
            const config = await window.api.getDefaultConfig();
            setLlmConfig(config);
        })();
    }, []);

    useEffect(() => {
        const handler = (message) => {
            setStatus(message);
            // console.log("Status update:", message);
        };
        window.api.onStatusUpdate(handler);
        return () => window.api.offStatusUpdate(handler);
    }, []);

    const sendMessage = () => {
        if (inputValue.trim() === "") return;
        const newMessage = {
            id: Date.now(),
            type: "outgoing",
            body: { text: inputValue },
        };
        setMessages([...messages, newMessage]);
        setInputValue("");

        // Simulate an incoming message after a delay
        (async () => {
            setIsLoading(true);

            const response = await window.api.processPrompt(
                inputValue,
                messages.map((m) => ({
                    role: m.type === "outgoing" ? "user" : "assistant",
                    content: m.body.text,
                })),
                llmConfig,
            );
            console.log("Response from main process:", response);

            const incomingMessage = {
                id: Date.now() + 1,
                type: "incoming",
                body: { text: response },
            };
            setMessages((prevMessages) => [...prevMessages, incomingMessage]);

            setIsLoading(false);
        })();
    };

    return (
        <div className="h-screen flex flex-col bg-blue-300 text-sm">
            <div className="bg-gray-200 px-2 py-4">AutoMO Chat</div>
            <ChatMessages
                messages={messages}
                isLoading={isLoading}
                status={status}
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
