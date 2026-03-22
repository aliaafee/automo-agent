import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import Message from "./message";

function ChatMessages({ messages, className, isLoading, status }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className={twMerge("bg-gray-300 p-2 overflow-y-auto", className)}>
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
            {isLoading && (
                <div className="flex justify-center items-center py-2">
                    <div className="loader">
                        {status ? status : "Working..."}
                    </div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}

export default ChatMessages;
