import { twMerge } from "tailwind-merge";

function Message({ message, className }) {
    if (message.type === "incoming") {
        return (
            <div
                className={twMerge(
                    "flex gap-2 mb-2",
                    "justify-start",
                    className,
                )}
            >
                {/* <div className="rounded-lg  bg-blue-300 w-10 h-10 flex items-center justify-center text-xs">
                    AMO
                </div> */}
                <div className="rounded-lg rounded-tl-none bg-gray-100 p-2 whitespace-pre-wrap">
                    {message.body.text}
                </div>
            </div>
        );
    }

    if (message.type === "outgoing") {
        return (
            <div
                className={twMerge("flex gap-2 mb-2", "justify-end", className)}
            >
                <div className="rounded-lg rounded-tr-none  bg-blue-400 p-2  whitespace-pre-wrap">
                    {message.body.text}
                </div>
                {/* <div className="rounded-lg   bg-blue-300 w-10 h-10 flex items-center justify-center text-xs">
                    me
                </div> */}
            </div>
        );
    }
}

export default Message;
