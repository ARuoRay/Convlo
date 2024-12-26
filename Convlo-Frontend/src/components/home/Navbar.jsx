import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Bell,
  User,
  LogOut,
  Settings,
  MessageSquare,
  Users,
} from "lucide-react";
import { useWebsocket } from "../AuthWebsocket";
import { useAuth } from "../AuthToken";
import Profile from "./Profile";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

const Navbar = ({ username, onLogout }) => {
  const { disconnectWebSocket } = useWebsocket();
  const { token, fetchWithAuth } = useAuth();
  const location = useLocation(); // 用於判斷當前路徑
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // 修改個人資料 Modal 開關
  const [isConvloModalOpen, setIsConvloModalOpen] = useState(false); // Convlo Modal 開關
  const [randomMessage, setRandomMessage] = useState(""); // 隨機消息
  const [image, setImage] = useState(null);
  const [UserData, setUserData] = useState({
    username: "",
    nickName: "",
    profileContent: "",
    email: "",
    gender: "",
    vactorPath: "",
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const messages = [
    "今天中午要吃甚麼？",
    "快下班了嗎？偷瞄一下時鐘",
    "看一下老闆在不在，不在的話摸一下魚",
    "偵測到幸福能量過低，可愛貓迷圖片支援",
    "今天很努力了，下班獎勵一塊雞排！",
    "Convlo好用嗎？不好用要說喔",
    "下班要記得去健身喔",
    "感覺你今天會遇到好事喔",
    "在非洲，每有60秒....就有1分鐘過去",
    "明天過了，後天就會來到",
    "不吃東西，怎麼有力氣減肥"

  ];

  useEffect(() => {
    const loadUserDto = async () => {
      try {
        const fetchUserData = await fetchWithAuth(
          "http://localhost:8089/home/profile",
          "GET"
        );
        setUserData(fetchUserData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    if (location.pathname === "/home" && token) {
      loadUserDto();
    }


  }, [location.pathname, token, fetchWithAuth]);

  useEffect(() => {
    if (isConvloModalOpen) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setRandomMessage(messages[randomIndex]);
    }
  }, [isConvloModalOpen]);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    localStorage.removeItem("jwtToken");
    disconnectWebSocket();
    navigate("/login");
  };

  useEffect(() => {
    setShowDropdown(false); // 每次路徑變更都關閉下拉選單
  }, [location.pathname]);

  const handleHome = () => {
    if (localStorage.getItem("jwtToken")) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setImage(null);
    setIsModalOpen(false);
  };

  const handleConvloModalOpen = () => {
    setIsConvloModalOpen(true);
  };

  const handleConvloModalClose = () => {
    setIsConvloModalOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-200 to-teal-200 p-1 flex justify-between items-center z-50 shadow-md">
      {/* 左側：Logo 和首頁按鈕 */}
      <div className="flex items-center">
        <button
          className="flex items-center justify-center bg-blue-200 hover:bg-blue-300 text-gray-800 rounded-full p-2 shadow-sm transition-colors duration-200"
          onClick={handleHome}
        >
          <img
            src="https://imgur.com/Qprg2lc.png"
            alt="Convlo Logo"
            className="w-14 h-14 sm:w-12 sm:h-12 rounded-full"
          />
        </button>
        <button
          onClick={handleConvloModalOpen}
          className="ml-4 bg-blue-200 hover:bg-blue-300 text-gray-800 rounded-full shadow-sm transition-colors duration-200 px-4 py-2"
        >
          <span className="text-blue-600 text-3xl font-bold tracking-wide">Conv</span>
          <span className="text-teal-600 text-3xl font-bold tracking-wide">lo</span>
        </button>
      </div>

      {/* 右側按鈕群組 */}
      <div className="flex items-center space-x-3">
        {/* 僅在 /home 顯示按鈕群組 */}
        {location.pathname === "/home" && (
          <>
            <button className="bg-teal-200 hover:bg-teal-300 text-gray-800 rounded-full p-3 transition-colors duration-200 shadow-sm">
              <MessageSquare size={24} />
            </button>

            <button className="bg-teal-200 hover:bg-teal-300 text-gray-800 rounded-full p-3 transition-colors duration-200 shadow-sm">
              <Users size={24} />
            </button>

            <div className="relative">
              <button className="bg-teal-200 hover:bg-teal-300 text-gray-800 rounded-full p-3 transition-colors duration-200 shadow-sm">
                <Bell size={24} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            {/* 個人資料下拉選單 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-teal-200 hover:bg-teal-300 text-gray-800 rounded-full p-3 transition-colors duration-200 flex items-center shadow-sm"
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
                  <button
                    onClick={handleOpenModal}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                  >
                    <Settings size={16} className="mr-2" />
                    修改個人資料
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    登出
                  </button>
                </div>
              )}
            </div>
          </>



        )}

      </div>

      {/* Convlo Modal */}
      <Dialog open={isConvloModalOpen} onOpenChange={handleConvloModalClose}>
        <DialogContent className="sm:max-w-[425px] bg-gray-100 shadow-lg rounded-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-center text-xl">
              <button
                onClick={() => {
                  const alternateMessages = [
                    "在哪裡跌倒，就在哪裡躺下。",
                    "努力不一定會成功，但不努力一定會很輕鬆。",
                    "萬丈高樓買不起。",
                    "忍一時越想越氣，退一步越想越虧。",
                    "勤能補拙，看來你要非常的勤勞了。",
                    "不要在意別人怎麼看你，因為根本沒有人看你。",
                    "麻雀雖小，哪有我衰小。",
                    "今天不開心沒關係，反正明天也不會開心。",
                    "好好活下去，每天都有新打擊。",
                    "你才不是一無所有，你還有病。",
                    "每天起床照照鏡子，今天的自己又離夢想遠了一點。",
                    "當你覺得自己醜、窮的時候，別絕望，至少你的判斷是對的。",
                    "你要很愛自己，因為沒人會愛你。",
                    "年輕時多吃苦，老了就會習慣。",
                    "別再減肥了，你醜不是因為你胖。",
                    "失敗並不可怕，可怕的是你還相信這句話。",
                    "如果你覺得每天都累得跟狗一樣，那你真的誤會了，狗都沒你那麼累。",
                  ];
                  const randomIndex = Math.floor(Math.random() * alternateMessages.length);
                  setRandomMessage(alternateMessages[randomIndex]);
                }}
                className="bg-transparent hover:bg-black hover:shadow-lg rounded-full p-2 transition-colors duration-200 focus:outline-none"
              >
                <MessageSquare className="h-6 w-6 text-gray-600 hover:text-white transition-colors duration-200" />
              </button>
              Convlo告訴你：
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-gray-700 text-xl font-semibold mb-4 text-center">
              {randomMessage}
            </p>
          </div>

          <DialogFooter className="mt-6 flex justify-center">
            <button
              onClick={handleConvloModalClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              關閉
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      {isModalOpen && (
        <Profile
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          UserData={UserData}
          setUserData={setUserData}
          image={image}
          setImage={setImage}
        />
      )}
    </nav>
  );
};

export default Navbar;
