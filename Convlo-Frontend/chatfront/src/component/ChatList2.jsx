import React from "react";

function ChatList({ chats, onChatClick }) {
  return (
    <div className="space-y-1 ">
      <h2 className="text-lg font-bold text-gray-800 mb-4">群組列表</h2>
      {chats.map((chat) => (
        <div
          key={chat.chatId}
          className="flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 bg-white shadow-md hover:bg-blue-50"
          onClick={() => {

            onChatClick(chat.chatId);
          }}
        >
          {/* 頭像區域 */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {/* 預留圖片空間，可替換為動態圖片 */}
            <img
              src={`https://via.placeholder.com/150`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 文本區域 */}
          <div className="ml-4 flex-1">
            <p className="text-lg font-semibold text-gray-800">{chat.chatname}</p>
            <p className="text-sm text-gray-500">創立者: {chat.creator.username}</p>
          </div>

          {/* 狀態區域 */}
          <div>
            {chat.unread && <span className="w-3 h-3 bg-blue-500 rounded-full block"></span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
