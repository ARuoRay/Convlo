import React, { useState, useEffect, useRef } from "react";

function ChatContent1({ chatname ,chatId }) {
  const [messages, setMessages] = useState([]); // 訊息列表
  const [messageInput, setMessageInput] = useState(""); // 輸入框中的訊息
  const [socket, setSocket] = useState(null); // WebSocket 實例
  const [sendUser, setSendUser] = useState(""); // 用戶名
  const messageEndRef = useRef(null); // 用於滾動到最新消息的引用



  const jwtToken = localStorage.getItem("jwtToken");

  if (!jwtToken) {
    window.location.href = "/login"; // 跳轉到登錄頁
  }

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8089/home/chat/${chatId}?token=${jwtToken}`
    );
    console.log("我的sockte偵測到"+chatId);

    socket.onopen = () => {
      console.log("WebSocket 連接已成功建立！");
    };

    socket.onmessage = (event) => {
      const newMessage = event.data;
      if (newMessage.startsWith("成功連接到聊天室")) {
        const username = newMessage.split("用戶名：")[1];
        setSendUser(username);
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket 錯誤: ", error);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`連接關閉，狀態碼: ${event.code}`);
      } else {
        console.error("WebSocket 連接異常關閉");
      }
    };

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, [jwtToken, chatId]);

  const sendMessage = () => {
    if (messageInput.trim() !== "" && socket) {
      console.log("Message sent:", messageInput); // 模擬發送訊息

      const messageDto = {
        sendUser,
        receiveChat: chatId,
        message: messageInput.trim(),
      };

      socket.send(JSON.stringify(messageDto));
      setMessageInput("");
    } else {
      alert("請輸入有效的訊息！");
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 h-full">
        {/* 動態顯示 chatname */}
        <h2 className="text-xl font-bold mb-4">{chatname || "聊天室"}</h2>
  
        <div className="h-3/4 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col-reverse max-h-[60vh] ">
          {messages.map((message, index) => (
            <div key={index} className="p-2 bg-blue-100 rounded mb-2 shadow">
              {message}
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
  
        <div className="flex mt-4">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="請輸入訊息..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={sendMessage}
          >
            發送
          </button>
        </div>
      </div>
    </div>
  );
  
}

export default ChatContent1;