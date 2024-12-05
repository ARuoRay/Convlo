import React, { useEffect, useState } from "react"
import ChatList from "../component/ChatList";
import ChatContent from "../component/ChatContent";
import Profile from "./Profile";
import { fetchTodos,getTodo, postTodo, putTodo, deleteTodo } from '../service/home'
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
      id: 5,
      creator: {
        username: "abc"
      },
      chatname: "123",
    },
    {
      id: 5,
      creator: {
        username: "abc"
      },
      chatname: "123",
    },
  ]);

  useEffect(() => {
    const Todo = async () => {
      const response = await fetch('http://localhost:80819/home', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
    Todo();
  }, []) 


  useEffect(()=>{
    const getUser=async()=>{
      const data=await getTodo();
      setUserData(data);
    }
    getUser();
  },[]) 
  console.log(UserData)


  useEffect(() => {
    // 檢查是否存在 JWT

    if (!token) {
      // 如果沒有 JWT，重定向到登入頁面
      navigate('/login');
    }
  }, [token]);


  const handleLogout = () => { // 登出函式
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
    <div>
      <h1>歡迎來到首頁！</h1>
      <p>你已經成功登入。</p>
      <p>你已經成功登入。</p>
      <p>你已經成功登入。</p>
      <p>你已經成功登入。</p>
      <p>你已經成功登入。</p>
      <button className="btn btn-primary btn-lg" onClick={handleOpenModal}>修改個人資料</button>
      <Profile isOpen={isModalOpen} onClose={handleCloseModal} UserData={UserData} setUserData={setUserData} />
      <div>
        {/* <ChatList chats={chats} /> */}
        <ChatContent chats={chats} />
      </div>
    </div>
  );
}

export default Home;
