import React, { useEffect, useState } from "react";
import ChatList from "../component/ChatList";
import ChatContent from "../component/ChatContent1";
import Profile from "./Profile";
import { fetchTodos, getTodo, postTodo, putTodo, deleteTodo } from '../service/home';
import { useNavigate } from "react-router-dom";

function Home() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const [UserData, setUserData] = useState({
    username: "",
    nickName: "",
    profileContent: "",
    email: "",
    gender: ""
  });

  const [chats, setChats] = useState([
    {
      id: 1,
      creator: {
        username: "user1"
      },
      chatname: "Chat Room 1",
    },
    {
      id: 2,
      creator: {
        username: "user2"
      },
      chatname: "Chat Room 2",
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({
    1: [
      { sender: "user1", content: "Hello from Chat Room 1!" },
      { sender: "user2", content: "Hi there!" }
    ],
    2: [
      { sender: "user2", content: "Welcome to Chat Room 2!" },
      { sender: "user1", content: "Thanks!" }
    ]
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    navigate('/login');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChatClick = (chatId) => {
    // 處理點擊聊天室的操作，在同一個頁面中更新聊天內容
    setSelectedChat(chatId);
    console.log("Selected Chat ID:", chatId);
  };

  const handleAddChat = () => {
    // 添加一個新的聊天室
    const newChatId = chats.length + 1;
    const newChat = {
      id: newChatId,
      creator: {
        username: `user${newChatId}`
      },
      chatname: `Chat Room ${newChatId}`
    };
    setChats([...chats, newChat]);
    setMessages({
      ...messages,
      [newChatId]: [] // 初始化新聊天室的消息列表
    });
  };

  return (
    <div className="flex flex-1 h-full">
      {/* 左側的聊天室列表區塊 */}
      <div className="w-1/4 bg-white shadow-lg p-4 h-full overflow-y-auto border-r border-blue-300">
        <button className="btn btn-primary w-full mb-4" onClick={handleAddChat}>新增聊天室</button>
        <ChatList
          chats={chats}
          itemClassName="py-2 px-4 border-b border-blue-200 hover:bg-blue-100 cursor-pointer"
          onClick={(chat) => handleChatClick(chat.id)}
        />
      </div>

      {/* 中間的聊天內容區塊 */}
      <div className="flex-1 bg-white shadow-lg p-6 mx-4">
        <div className="bg-gray-100 shadow-md p-6 rounded-lg h-full">
          {selectedChat ? (
            <ChatContent messages={messages[selectedChat]} />
          ) : (
            <p className="text-center text-gray-500">請選擇一個聊天室開始聊天</p>
          )}
        </div>
      </div>

      {/* 右側的聊天對象資訊區塊 */}
      <div className="w-1/4 bg-white shadow-lg p-4">
        {selectedChat ? (
          <Profile isOpen={isModalOpen} onClose={handleCloseModal} UserData={UserData} setUserData={setUserData} />
        ) : (
          <p className="text-center text-gray-500">請選擇一個聊天室以查看對象資訊</p>
        )}
        <button className="btn btn-primary btn-lg mt-4 w-full" onClick={handleOpenModal}>修改個人資料</button>
      </div>
    </div>
  );
}

export default Home;
