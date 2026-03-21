import { useState } from "react";

function ChatWindow() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-screen flex flex-col bg-blue-300 text-sm">
      <div className="bg-gray-200 px-2 py-4">AutoMO Chat</div>
      <div className="bg-gray-300 grow p-2 overflow-y-auto">
        <div className="flex gap-2 mb-2">
          {/* <div className="rounded-lg  bg-blue-300 w-10 h-10 flex items-center justify-center text-xs">
            AMO
          </div> */}
          <div className="rounded-lg rounded-tl-none bg-gray-100 p-2">
            This is a message
          </div>
        </div>
        <div className="flex gap-2 justify-end mb-2">
          <div className="rounded-lg rounded-tr-none  bg-blue-400 p-2">
            This is a message
          </div>
          {/* <div className="rounded-lg   bg-blue-300 w-10 h-10 flex items-center justify-center text-xs">
            me
          </div> */}
        </div>
      </div>
      <div className="bg-gray-200 px-2 py-2 flex gap-2">
        <textarea
          className="w-full px-2 py-1 rounded-lg outline-0 border border-gray-400 focus:border-blue-500 resize-none"
          placeholder="Type a message..."
        />

        <button className="bg-blue-500 text-white px-2 py-1 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
