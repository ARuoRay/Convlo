import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchTodos, postTodo, putTodo, deleteTodo } from '../service/Logintodo';

// 定義 Login 組件，用於顯示登入表單
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwtToken");
  // 處理表單提交
  const handleSubmit = async (e) => {
      e.preventDefault();
      // 假設簡單的驗證
      if (!username || !password) {
          setErrorMessage("請輸入會員帳號和密碼");
          return;
      }

      const user = {
          username: username,
          password: password,

      }

      //console.log(user);
      //將資料丟後端去做比對
      try {
          const response = await postTodo(user);
          //console.log(response);
          localStorage.setItem('jwtToken', response);
          navigate('/home');

          // 清空錯誤訊息
          setErrorMessage("");
      } catch (error) {
        const errorMsg = error.message || '發生未知錯誤';
        setErrorMessage(errorMsg);
        console.log('網路錯誤:', errorMsg);
    }





  };

  const handleRegister = () => {
    navigate('/Register'); // 當用戶點擊建立會員按鈕時，導航到 /Register 路徑
  };


  return (
    
      <div className="bg-gray-300 p-10 rounded-lg shadow-lg w-80 max-w-sm flex-shrink-0 relative right-20">
      {/* 登入標題 */}
        <h2 className="text-2xl font-bold mb-6 text-center">登入</h2>
        {/* 錯誤訊息顯示 */}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        {/* 帳號輸入框 */}
        <input 
          type="text" 
          placeholder="帳號" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* 密碼輸入框 */}
        <input 
          type="password" 
          placeholder="密碼" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* 登入按鈕 */}
        <button 
          onClick={handleSubmit} 
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          輸入
        </button>
        <div className="flex justify-between mt-4">
          {/* 建立會員按鈕 */}
          <button className="text-blue-600 hover:underline" onClick={handleRegister}>建立會員</button>
          {/* 忘記密碼按鈕 */}
          <button className="text-blue-600 hover:underline">忘記密碼</button>
        </div>
      </div>
    
  );
};

export default Login;