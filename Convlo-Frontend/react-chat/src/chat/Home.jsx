import React, { useEffect, useState } from "react"
import ChatList from "../component/ChatList";
import { fetchTodos, getTodo, postTodo, putTodo, deleteTodo } from '../service/home'
import { useLocation, useNavigate } from "react-router-dom";
import ChatContent1 from "../component/ChatContent1";
import ImagePreview from "../component/ImagePreview";


function Home() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const [errorMessage, setErrorMessage] = useState();
  const [image,setImage]=useState(null);
  const navigate = useNavigate();
  const location=useLocation();
  const [user, setUser] = useState();

  // const [chats, setChats] = useState([
  //   {
  //     id: 5,
  //     creator: {
  //       username: "abc"
  //     },
  //     chatname: "123",
  //   },
  //   {
  //     id: 5,
  //     creator: {
  //       username: "abc"
  //     },
  //     chatname: "123",
  //   },
  // ]);

  useEffect(() => {// 檢查是否存在 JWT
    if (!token) {
      // 如果沒有 JWT，重定向到登入頁面
      navigate('/login');
    }
  }, []);


  const handleLogout = () => { // 登出函式
    // 刪除 localStorage 中的 JWT token
    localStorage.removeItem('jwtToken');
    // 導航回登入頁面
    navigate('/login');
  };

  const handleEditProfile = () => {// 導航到個人資料頁面
    navigate('/home/profile');
  };

  return (
    <div>
      <h1>歡迎來到首頁！</h1>
      <p>你已經成功登入。</p>
      <button className="btn btn-danger" onClick={handleLogout}>登出</button>
      <button className="btn btn-primary btn-lg" onClick={handleEditProfile}>修改個人資料</button>

      <div>
        <ChatList/>
        {image && <ImagePreview imageUrl={image} />}
        <ChatContent1/>
      </div>
    </div>
  );
}

export default Home;

