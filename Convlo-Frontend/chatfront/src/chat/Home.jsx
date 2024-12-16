import React, { useEffect, useState } from "react"
import ChatList from "../component/ChatList";
import { useLocation, useNavigate } from "react-router-dom";
import ChatContent1 from "../component/ChatContent1";
import ImagePreview from "../component/ImagePreview";
import { useAuth } from "../component/AuthToken";


function Home() {
  const [image,setImage]=useState(null);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

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

  const handleEditProfile = () => {// 導航到個人資料頁面
    navigate('/home/profile');
  };

  return (
    <div>
      <h1>歡迎來到首頁！</h1>
      <p>你已經成功登入。</p>
      <button className="btn btn-danger" onClick={logout}>登出</button>
      <button className="btn btn-primary btn-lg" onClick={handleEditProfile}>修改個人資料</button>

      <div>
        <ChatList/>
        <ImagePreview  />
        <ChatContent1/>
      </div>
    </div>
  );
}

export default Home;

