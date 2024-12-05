import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "tailwindcss/tailwind.css";

// Navbar 組件用於顯示導航欄
const Navbar = () => (
  <nav className="bg-gray-800 w-full py-4 px-6 flex justify-between items-center">
    <div className="flex items-center">
      {/* 按鈕導航到首頁 */}
      <button className="text-white font-bold w-10 h-10 mr-4">首頁</button>
    </div>
    {/* 聊天應用的標題 */}
    <span className="text-white text-xl">聊天室</span>
    <div className="flex space-x-4">
      {/* 其他按鈕，用於更多選項、通知和個人檔案 */}
      <button className="text-white font-bold w-10 h-10">更多</button>
      <button className="text-white font-bold w-10 h-10">通知</button>
      <button className="text-white font-bold w-10 h-10">個人</button>
    </div>
  </nav>
);

// ChatList 組件用於顯示聊天聯繫人列表
const ChatList = () => (
  <div className="w-full lg:w-1/4 bg-gray-900 text-white h-full p-4 overflow-y-auto">
    <h2 className="text-xl mb-4">聊天列表</h2>
    <ul>
      {/* 顯示朋友的聊天列表 */}
      {["朋友A", "朋友B", "朋友C", "朋友D", "朋友E", "朋友F"].map((chat, index) => (
        <li key={index} className="mb-4 p-2 hover:bg-gray-700 rounded cursor-pointer">
          {chat}
        </li>
      ))}
    </ul>
  </div>
);

// ChatWindow 組件用於顯示聊天訊息和輸入框
const ChatWindow = () => {
  // 用於管理聊天訊息和用戶輸入的狀態
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // 使用 SockJS 和 STOMP 初始化 WebSocket 連接
    const socket = new SockJS("http://localhost:8081/chat");
    const client = Stomp.over(socket);
    client.connect({}, () => {
      // 訂閱主題以接收訊息
      client.subscribe("/topic/messages", (message) => {
        if (message.body) {
          setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
        }
      });
    });
    setStompClient(client);

    // 清理函數，用於斷開 WebSocket 連接
    return () => {
      if (client !== null) {
        client.disconnect();
      }
    };
  }, []);

  // 處理發送新訊息的函數
  const handleSendMessage = () => {
    if (input.trim() !== "") {
      const message = {
        sender: "我",
        content: input,
        timestamp: new Date().toLocaleString(),
      };
      // 使用 STOMP 客戶端發送訊息
      if (stompClient) {
        stompClient.send("/app/chat", {}, JSON.stringify(message));
      }
      setInput("");
    }
  };

  return (
    <div className="w-full lg:w-1/2 bg-gray-800 text-white h-full p-6 flex flex-col">
      {/* 顯示聊天訊息 */}
      <div className="flex-grow overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <p className="text-sm text-gray-400">{message.sender} - {message.timestamp}</p>
            <p className={`p-2 rounded inline-block ${message.sender === "我" ? "bg-blue-600" : "bg-gray-700"}`}>{message.content}</p>
          </div>
        ))}
      </div>
      {/* 輸入框和發送按鈕，用於發送新訊息 */}
      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="輸入訊息..."
          className="flex-grow p-3 rounded bg-gray-700 text-white mr-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="bg-blue-600 p-3 rounded text-white hover:bg-blue-700"
          onClick={handleSendMessage}
        >
          發送
        </button>
      </div>
    </div>
  );
};

// UserProfile 組件用於顯示用戶資訊和操作
const UserProfile = () => (
  <div className="w-full lg:w-1/4 bg-gray-900 text-white h-full p-4">
    <h2 className="text-xl mb-4">個人檔案</h2>
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        {/* 用戶頭像的佔位符 */}
        <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
        <span className="text-lg">朋友A</span>
      </div>
      {/* 用於不同用戶操作的按鈕 */}
      <button className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">分享</button>
      <button className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">個人檔案</button>
      <button className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">隱私通知</button>
      <button className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">搜尋</button>
    </div>
  </div>
);

// 用於組織聊天應用結構的布局組件
const ChatAppLayout = () => (
  <div className="flex flex-col lg:flex-row h-full w-full">
    <ChatList />
    <ChatWindow />
    <UserProfile />
  </div>
);

// 主應用組件
const App = () => (
  <div className="h-screen flex flex-col w-full">
    <Navbar />
    <div className="flex-grow w-full">
      <ChatAppLayout />
    </div>
  </div>
);

export default App;
