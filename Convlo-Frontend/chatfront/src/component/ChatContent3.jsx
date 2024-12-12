import React, { useState, useEffect, useRef } from "react";
import { getAllTodos, getProfileTodo, getChatTodo } from "../service/ChatHistory";

function ChatContent1({ chatname, chatId }) {
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



  const jwtToken = localStorage.getItem("jwtToken");

  if (!jwtToken) {
    window.location.href = "/login"; // 跳轉到登錄頁
  }

  // useEffect(() => { //拿取個人資料 和會員相關的聊天室
  //   const getProfile = async () => {
  //     try {
  //       const Profile = await getProfileTodo();
  //       setSendUser(Profile);
  //     } catch (error) {
  //       console.log("取得資料失敗:" + error);
  //     }
  //   }

  //   const getChatProfile = async () => {
  //     try {
  //       const ChatProfile = await getChatTodo(chatId);
  //       setReceiveChat(ChatProfile)
  //     } catch (error) {
  //       console.log("取得資料失敗:" + error);
  //     }
  //   }

  //   const getChatHisotory = async () => { //用http搜尋歷史紀錄
  //     try {
  //       const ChatHisotory = await getAllTodos(chatId);// 取得聊天記錄
  //       //console.log(ChatHisotory);
  //       setMessages(ChatHisotory);
  //     } catch (error) {
  //       console.error("取得聊天紀錄失敗:" + error);
  //     }
  //   }

  //   getChatHisotory();
  //   getProfile();
  //   getChatProfile();
  // }, [])

  // 初始化用戶資料、聊天室資料和歷史訊息
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getProfileTodo();
        setSendUser(profile);

        const chatProfile = await getChatTodo(chatId);
        setReceiveChat(chatProfile);

        const chatHistory = await getAllTodos(chatId);
        setMessages(chatHistory);
      } catch (error) {
        console.error("資料獲取失敗:", error);
      }
    };

    fetchData();
  }, [chatId]);



  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8089/home/chat/${chatId}?token=${jwtToken}`
    );
    console.log(socket);

    socket.onopen = () => {
      console.log("WebSocket 連接已成功建立！");
    };

    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log("收到新訊息:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
    if (!sendUser) {
      alert("用戶資料尚未載入，請稍後再試！");
      return;
    }


    if (messageInput.trim() !== "" && socket) {
      console.log("Message sent:", messageInput); // 模擬發送訊息

      const messageDto = {
        sendUser: sendUser,
        receiveChat: receiveChat,
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

        <div className="h-3/4 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col max-h-[60vh]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded mb-2 shadow ${message.sendUser?.username === sendUser.username
                  ? "bg-blue-200 text-right ml-auto"
                  : "bg-gray-200 text-left mr-auto"
                }`}
              style={{
                maxWidth: "80%",
              }}
            >
              <strong>
                {message.sendUser?.username === sendUser.username ? "我" : message.sendUser?.username}
              </strong>
              : {message.message}
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