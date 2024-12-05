import React, { useState } from 'react';

// 定義 Login 組件，用於顯示登入表單
const Login = () => {
  // 使用 useState 管理使用者名稱的狀態
  const [username, setUsername] = useState('');
  // 使用 useState 管理密碼的狀態
  const [password, setPassword] = useState('');
  // 使用 useState 管理錯誤訊息的狀態
  const [errorMessage, setErrorMessage] = useState("");

  // 處理登入邏輯
  const handleLogin = () => {
    // 簡單驗證：若使用者名稱或密碼未填寫，顯示錯誤訊息
    if (!username || !password) {
      setErrorMessage("請輸入帳號和密碼");
      return;
    }
    // 成功登入後顯示帳號和密碼的提示框
    alert(`帳號: ${username}, 密碼: ${password}`);
    // 清空錯誤訊息
    setErrorMessage("");
  };

  return (
    <div className="flex h-screen items-center justify-end p-6 bg-blue-200">
      {/* 調整登入框位置 */}
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
          onClick={handleLogin} 
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          輸入
        </button>
        <div className="flex justify-between mt-4">
          {/* 建立會員按鈕 */}
          <button className="text-blue-600 hover:underline">建立會員</button>
          {/* 忘記密碼按鈕 */}
          <button className="text-blue-600 hover:underline">忘記密碼</button>
        </div>
      </div>
    </div>
  );
};

export default Login;