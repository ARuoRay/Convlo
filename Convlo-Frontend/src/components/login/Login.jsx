import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchTodos, postTodo, putTodo, deleteTodo } from '../../service/Logintodo';
import { useAuth } from '../AuthToken';

// 定義 Login 組件，用於顯示登入表單
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken, fetchWithAuth } = useAuth();
  const navigate = useNavigate();

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
      // const response = await fetchWithAuth('http://localhost:8089/Login','POST', user);
      //console.log(response);
      setToken(response); // 儲存 Token
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

  const handleForget = () => {
    navigate('/forget'); // 當用戶點擊建立會員按鈕時，導航到 /Register 路徑
  };


  return (
    <div className="flex items-center justify-center min-h-full bg-gradient-to-r from-blue-200 to-teal-200">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl flex">
        {/* 左側 Logo 與標題 */}
        <div className="flex-1 pr-10">
          <img
            src="https://imgur.com/Qprg2lc.png"
            alt="Convlo Logo"
            className="w-16 h-16 mb-4"
          />
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">登入</h2>
          <p className="text-sm text-gray-600">使用您的 Convlo 帳戶來登入</p>
        </div>

        {/* 右側表單 */}
        <div className="flex-1">
          {/* 錯誤訊息顯示 */}
          {errorMessage && (
            <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
          )}

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

          {/* 忘記密碼按鈕 */}
          <button
            className="text-sm text-blue-600 hover:underline mb-4 block text-left"
            onClick={handleForget}
          >
            忘記密碼？
          </button>

          {/* 登入按鈕 */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
          >
            登入
          </button>

          {/* 建立會員按鈕 */}
          <p className="text-sm text-gray-600 mt-6">
            尚未註冊？{" "}
            <button
              className="text-blue-600 hover:underline focus:outline-none"
              onClick={handleRegister}
            >
              建立帳戶
            </button>
          </p>
        </div>
      </div>
    </div>

  );



};

export default Login;