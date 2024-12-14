import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 建立 AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const navigate = useNavigate();

  // 登出方法
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    navigate('/login'); // 跳轉到登錄頁
  };

  // 封裝 fetch 請求，並支援 GET, POST, PUT, DELETE
  const fetchWithAuth = async (url, method = 'GET', body = null) => {
    let headers = {
      'Content-Type': 'application/json',  // 確保設定 Content-Type 爲 application/json
    };

    const token = localStorage.getItem('jwtToken');
    if (token) {
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    }

    try {
      const options = {
        method,
        headers,
      };

      if (body) {
        options.body = JSON.stringify(body);  // 將請求體轉化爲 JSON 字串
      }

      const response = await fetch(url, options);
      const result = await response.json();

      // if (response.status === 403) {
      //   logout();  // 如果返回 403 錯誤，自動登出
      //   throw new Error('Token expired or invalid');
      // }

      if (response.status === 200) {
        return result.data;  // 返迴響應資料
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  };

  const value = { token, setToken, logout, fetchWithAuth };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);