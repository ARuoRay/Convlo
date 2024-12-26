import React, { useEffect } from "react";
import { useState } from "react";
import { fetchTodos, postTodo, putTodo, deleteTodo } from '../../service/Registertodo';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthToken";


function Register() {

  const [RegisterData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    gender: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [AllUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();

  //獲取所有會員資料
  useEffect(() => {
    console.log('抓取資料成功');
    // fetchTodos()
    fetchWithAuth('http://localhost:8089/Register', 'GET')
      .then(data => setAllUsers(data))
      .catch((error) => console.error('error:', error));
  }, [])


  // 處理表單變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...RegisterData, [name]: value,
    });
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(AllUsers);
    // 簡單的表單驗證
    if (!RegisterData.username || !RegisterData.password || !RegisterData.email || !RegisterData.gender) {
      setErrorMessage("所有欄位都必須填寫");
      return;
    }

    if (AllUsers.some(user => user.username === RegisterData.username)) {
      setErrorMessage("會員帳號已存在!請重新註冊");
      return;
    }

    // 假設成功註冊
    setSuccessMessage("註冊成功！");
    setErrorMessage(""); // 清除錯誤訊息
    navigate('/Login'); // 跳轉回登入頁面

    console.log(RegisterData);
    try {
      await postTodo(RegisterData);
    } catch (error) {
      console.log('網路錯誤:', error.message);
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
          <h2 className="text-3xl font-semibold text-gray-800">註冊會員</h2>
          <p className="text-sm text-gray-600">請填寫以下資訊完成註冊</p>
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
            name="username"
            value={RegisterData.username}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 密碼輸入框 */}
          <input
            type="password"
            placeholder="密碼"
            name="password"
            value={RegisterData.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 電子郵件輸入框 */}
          <input
            type="email"
            placeholder="電子郵箱"
            name="email"
            value={RegisterData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 性別選擇 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">性別</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="gender"
                  value="male"
                  checked={RegisterData.gender === "male"}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-700">男</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="gender"
                  value="female"
                  checked={RegisterData.gender === "female"}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-700">女</span>
              </label>
            </div>
          </div>

          {/* 註冊按鈕 */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg hover:opacity-90 transition duration-200 mb-4"
          >
            註冊
          </button>

          {/* 返回按鈕 */}
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;