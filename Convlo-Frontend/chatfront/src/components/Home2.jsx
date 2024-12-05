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

  useEffect(() => {
    const Todo = async () => {
      const response = await fetch('http://localhost:8089/home', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    };
    Todo();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const data = await getTodo();
      setUserData(data);
    };
    getUser();
  }, []);

  console.log(UserData);

  useEffect(() => {
    // 檢查是否存在 JWT
    if (!token) {
      // 如果沒有 JWT，重定向到登入頁面
      navigate('/login');
    }
  }, [token]);

  const handleLogout = () => {
    // 刪除 localStorage 中的 JWT token
    localStorage.removeItem('jwtToken');
    setToken(null);
    // 導航回登入頁面
    navigate('/login');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true); // 打開模態框
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 關閉模態框
  };

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* 左側的聊天室列表區塊 */}
      <div className="w-1/4 bg-white shadow-lg p-4">
        <ChatList chats={chats} />
      </div>
      
      {/* 右側的聊天內容和個人資料區塊 */}
      <div className="flex-1 flex items-center justify-center p-6">
        {/* 外層容器：讓 Home 區塊置中顯示 */}
        <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-3xl">
          {/* Home 內容 */}
          <h1 className="text-center text-3xl font-bold mb-6">歡迎來到首頁！</h1>
          <p className="mb-4">你已經成功登入。</p>
          <button className="btn btn-primary btn-lg mb-6" onClick={handleOpenModal}>修改個人資料</button>
          <Profile isOpen={isModalOpen} onClose={handleCloseModal} UserData={UserData} setUserData={setUserData} />
          <div>
            <ChatContent chats={chats} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
