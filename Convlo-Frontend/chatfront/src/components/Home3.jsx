import React, { useEffect, useState } from "react";
import ChatList from "../component/ChatList";
import ChatContent from "../component/ChatContent";
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
    const selected = chats.find(chat => chat.id === chatId);
    setSelectedChat(selected);
    console.log("Selected Chat ID:", chatId);
  };

  return (
    <div className="flex flex-1 h-full">
      {/* 左側的聊天室列表區塊 */}
      <div className="w-1/4 bg-white shadow-lg p-4 h-full overflow-y-auto border-r border-blue-300">
        <ChatList
          chats={chats}
          itemClassName="py-2 px-4 border-b border-blue-200 hover:bg-blue-100 cursor-pointer"
          onClick={handleChatClick}
        />
      </div>

      {/* 中間的聊天內容區塊 */}
      <div className="flex-1 bg-white shadow-lg p-6 mx-4">
        <div className="bg-gray-100 shadow-md p-6 rounded-lg h-full">
          {selectedChat ? (
            <ChatContent chat={selectedChat} />
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
