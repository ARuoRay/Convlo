import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Home,
  MoreHorizontal,
  Bell,
  User,
  LogOut,
  Settings,
  MessageSquare,
  Users
} from 'lucide-react';

const Navbar = ({ username, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(3); // 示例通知數量
  const navigate = useNavigate(); // 導航函式

  // 將登出函式移到這裡，並確保可以使用 `navigate`
  const handleLogout = () => {
    // 刪除 localStorage 中的 JWT token
    localStorage.removeItem('jwtToken');
    // 導航回登入頁面
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center z-50 shadow-lg">
      {/* Logo 和首頁按鈕 */}
      <div className="flex items-center">
        <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-2 flex items-center justify-center transition-colors duration-200">
          <Home size={24} />
          <span className="ml-2 hidden md:inline">首頁</span>
        </button>
      </div>

      {/* 中間標題 */}
      <div className="flex items-center space-x-4">
        <span className="text-white text-xl font-semibold">即時通訊系統</span>
      </div>

      {/* 右側按鈕群組 */}
      <div className="flex items-center space-x-3">
        {/* 聊天室按鈕 */}
        <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-2 transition-colors duration-200">
          <MessageSquare size={24} />
        </button>

        {/* 好友列表按鈕 */}
        <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-2 transition-colors duration-200">
          <Users size={24} />
        </button>

        {/* 通知按鈕 */}
        <div className="relative">
          <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-2 transition-colors duration-200">
            <Bell size={24} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>

        {/* 個人資料下拉選單 */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-2 transition-colors duration-200 flex items-center"
          >
            <User size={24} />
          </button>

          {/* 下拉選單 */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
              {username && (
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  {username}
                </div>
              )}
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Settings size={16} className="mr-2" />
                設定
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                登出
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
