import React, { useState, useEffect, useRef } from "react";

function ChatContent1() {
  // 連接所需的狀態
  const [messages, setMessages] = useState([]); // 訊息列表
  const [messageInput, setMessageInput] = useState(""); // 輸入框中的訊息
  const [socket, setSocket] = useState(null); // WebSocket 實例
  const [sendUser, setSendUser] = useState(""); // 用戶名
  const messageEndRef = useRef(null); // 用於滾動到最新消息的引用

  // 假設從 localStorage 取得 JWT Token
  const jwtToken = localStorage.getItem("jwtToken"); // 取得儲存的 JWT token
  const roomId = "1"; // 假設房間 ID 爲 '1'

  // 如果沒有 JWT token，則跳轉到登錄頁面
  if (!jwtToken) {
    window.location.href = "/login"; // 跳轉到登錄頁
  }

  useEffect(() => {
    // WebSocket 連接
    const socket = new WebSocket(
      `ws://localhost:8089/home/${roomId}?token=${jwtToken}`
    );

    // 連接成功時的處理
    socket.onopen = () => {
      console.log("WebSocket 連接已成功建立！");
    };

    // 處理接收到的訊息
    socket.onmessage = (event) => {
      const newMessage = event.data;
      if (newMessage.startsWith("成功連接到聊天室")) {
        // 從訊息中提取用戶名
        const username = newMessage.split("用戶名：")[1];
        setSendUser(username); // 設定 sendUser 為用戶名
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    // 錯誤處理
    socket.onerror = (error) => {
      console.error("WebSocket 錯誤: ", error);
    };

    // 連接關閉時的處理
    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`連接關閉，狀態碼: ${event.code}`);
      } else {
        console.error("WebSocket 連接異常關閉");
      }
    };

    // 將 socket 實例存入狀態
    setSocket(socket);

    // 清理 WebSocket 連接
    return () => {
      socket.close();
    };

  }, [jwtToken, roomId]);

  // 發送訊息
  const sendMessage = () => {
    if (messageInput.trim() !== "" && socket) {
      const messageDto = {
        sendUser, // 發送者的用戶名
        receiveChat: roomId, // 房間 ID
        message: messageInput.trim(), // 訊息內容
      };

      // 通過 WebSocket 發送訊息
      socket.send(JSON.stringify(messageDto));
      setMessageInput(""); // 發送後清空輸入框
    } else {
      alert("請輸入有效的訊息！");
    }
  };

  // 自動滾動到底部
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f4f4f9" }}>
      <div style={{ width: "80%", maxWidth: "600px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "white", padding: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <h2>聊天室</h2>
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <input
          style={{
            width: "calc(100% - 100px)",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="請輸入訊息..."
        />
        <button
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={sendMessage}
        >
          發送
        </button>
      </div>
    </div>
  );
}

export default ChatContent1;

