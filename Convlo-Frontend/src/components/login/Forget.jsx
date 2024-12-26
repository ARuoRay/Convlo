import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { sendEmail } from '../../service/Logintodo';
import { useAuth } from '../AuthToken';

// 定義 Login 組件，用於顯示登入表單
function Forget() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken, fetchWithAuth } = useAuth();
  const navigate = useNavigate();

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username: username,
      email: email,
    }
    console.log(user);


    try {
      const response = await sendEmail(user);
      // const response = await fetchWithAuth('http://localhost:8089/Login/Forget','POST', user);
      console.log(response);
      navigate('/login');

      // 清空錯誤訊息
      setErrorMessage("");
    } catch (error) {
      const errorMsg = error.message || '發生未知錯誤';
      setErrorMessage(errorMsg);
      console.log('網路錯誤:', errorMsg);
    }
  };

  return (

    <div className="flex items-center justify-center min-h-full bg-gradient-to-r from-blue-200 to-teal-200">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl flex flex-col items-center">
        {/* 標題與描述 */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://imgur.com/Qprg2lc.png"
            alt="Convlo Logo"
            className="w-16 h-16 mb-4"
          />
          <h2 className="text-3xl font-semibold text-gray-800">忘記密碼</h2>
          <p className="text-sm text-gray-600">請輸入您的帳號與信箱來重設密碼</p>
        </div>

        {/* 表單區域 */}
        <div className="w-full">
          {/* 錯誤訊息顯示 */}
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}

          {/* 帳號輸入框 */}
          <input
            type="text"
            placeholder="帳號"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 信箱輸入框 */}
          <input
            type="email"
            placeholder="信箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 送出按鈕 */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg hover:opacity-90 transition duration-200 mb-4"
          >
            送出
          </button>

          {/* 返回按鈕 */}
          <button
            onClick={() => navigate('/login')} // 使用 react-router 的 navigate 返回 Login 頁面
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            返回
          </button>
        </div>
      </div>
    </div>


  );
};

export default Forget;