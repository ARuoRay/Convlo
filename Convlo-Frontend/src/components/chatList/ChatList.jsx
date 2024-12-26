import React from "react";

function ChatList({ chats, selectedChat, onChatClick }) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-bold text-gray-800 mb-4">群組列表</h2>
      {chats.map((chat) => (
        <div
          key={chat.chatId}
          className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 shadow-md ${selectedChat === chat.chatId ? "bg-white" : "bg-blue-100"
            } hover:bg-blue-50`}
          onClick={() => onChatClick(chat.chatId)}
        >
          {/* 文本區域 */}
          <div className="ml-4 flex-1">
            <p className="text-lg font-semibold text-gray-800">{chat.chatname}</p>
          </div>

          {/* 狀態區域 */}
          <div>
            {chat.unread && (
              <span className="w-3 h-3 bg-blue-500 rounded-full block"></span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
