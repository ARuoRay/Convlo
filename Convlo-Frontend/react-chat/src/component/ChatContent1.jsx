import React, { useState, useEffect, useRef } from "react";
import { getAllTodos, getChatTodo, getProfileTodo } from "../service/ChatHisotory"
import { useAuth } from "./AuthToken";

function ChatContent1() {
  // 連接所需的狀態
  const {fetchWithAuth } = useAuth();
  const [messages, setMessages] = useState([]); // 訊息列表
  const [messageInput, setMessageInput] = useState(""); // 輸入框中的訊息
  const [socket, setSocket] = useState(null); // WebSocket 實例
  const [sendUser, setSendUser] = useState({
    username: "",
    nickname: "",
    gender: ""
  }); // 用戶物件
  const [receiveChat, setReceiveChat] = useState({
    chatId: "",
    chatname: "",
    createAt: "",
    creator: sendUser
  })//聊天室物件
  const messageEndRef = useRef(null); // 用於滾動到最新消息的引用
  //console.log(messages);
  // 假設從 localStorage 取得 JWT Token
  const jwtToken = localStorage.getItem("jwtToken"); // 取得儲存的 JWT token
  const roomId = "1"; // 假設房間 ID 爲 '1'

  // 如果沒有 JWT token，則跳轉到登錄頁面
  if (!jwtToken) {
    window.location.href = "/login"; // 跳轉到登錄頁
  }

  useEffect(() => { //拿取個人資料 和會員相關的聊天室
    const getProfile = async () => {
      try {
        // const Profile = await getProfileTodo();
        const Profile =await fetchWithAuth('http://localhost:8089/home/chat','GET');
        setSendUser(Profile);
      } catch (error) {
        console.log("取得資料失敗:" + error);
      }
    }

    const getChatProfile = async () => {
      try {
        // const ChatProfile = await getChatTodo(roomId);
        const ChatProfile =await fetchWithAuth(`http://localhost:8089/home/chat/${roomId}/profile`,'GET');
        setReceiveChat(ChatProfile)
      } catch (error) {
        console.log("取得資料失敗:" + error);
      }
    }

    const getChatHisotory = async () => { //用http搜尋歷史紀錄
      try {
        // const ChatHisotory = await getAllTodos(roomId);// 取得聊天記錄
        const ChatHisotory =await fetchWithAuth(`http://localhost:8089/home/chat/${roomId}`,'GET');
        //console.log(ChatHisotory);
        setMessages(ChatHisotory);
      } catch (error) {
        console.error("取得聊天紀錄失敗:" + error);
      }
    }

    getProfile();
    getChatProfile();
    getChatHisotory();
  }, [])

  useEffect(() => { // WebSocket 連接

    const socket = new WebSocket(
       `ws://localhost:8089/home/chat/${roomId}?token=${jwtToken}`
      // `ws://localhost:8089/home?token=${jwtToken}`
    );

    // 連接成功時的處理
    socket.onopen = () => {
      console.log("WebSocket 連接已成功建立！");
    };

    // 處理接收到的訊息
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      //console.log(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };

  }, [jwtToken, roomId]);

  // 發送訊息
  const sendMessage = () => {
    if (messageInput.trim() !== "" && socket) {
      const messageDto = {
        sendUser: sendUser, // 發送者的用戶名
        receiveChat: receiveChat, // 房間 ID
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "600px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>{/*聊天室*/}{receiveChat.chatname}</h2>
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
            flexDirection: "column",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column", // 用戶名始終在訊息內容上方
                justifyContent: "flex-start", // 訊息始終顯示爲左對齊
                margin: "5px 0",
              }}
            >
              {/* 發送者的用戶名顯示在訊息內容上方 */}
              <div
                style={{
                  padding: "5px 0",
                  fontSize: "0.9rem",
                  color: "#333", // 發送者字體顏色
                  fontWeight: "bold",
                  textAlign: message.sendUser.username === sendUser.username ? "right" : "left", // 用戶名對齊：自己右對齊，對方左對齊
                }}
              >
                {message.sendUser.nickname? `${message.sendUser.nickname} (${message.sendUser.username})`: message.sendUser.username}
              </div>

              {/* 訊息內容 */}
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    message.sendUser.username === sendUser.username ? "#d1ffe7" : "#e6e6e6", // 綠色背景爲自己，灰色爲對方
                  textAlign: "left",
                  wordWrap: "break-word",
                  marginLeft: message.sendUser.username === sendUser.username ? "auto" : "0", // 自己的訊息靠右，其他人靠左
                  marginRight: message.sendUser.username === sendUser.username ? "0" : "auto", // 自己的訊息靠右，其他人靠左
                }}
              >
                {message.message}
              </div>
            </div>
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

