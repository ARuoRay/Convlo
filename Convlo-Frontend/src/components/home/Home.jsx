import React, { useEffect, useState } from "react";
import ChatList from "../chatList/ChatList";
import ChatWebsocket from "../chatContent/ChatWebsocket";
import ChatProfile from "../chatProfile/ChatProfile"; // <-- 新增：顯示聊天室成員資訊
import AddChat from "../chatList/AddChat";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthToken";
import { useWebsocket } from "../AuthWebsocket";

function Home() {
  const { token, fetchWithAuth } = useAuth();
  const { sendWsMessage } = useWebsocket();
  const navigate = useNavigate();

  // 聊天室列表
  const [chats, setChats] = useState([]);
  // 當前選擇的聊天室 ID
  const [selectedChat, setSelectedChat] = useState(null);
  // 訊息（以物件或陣列形式存放）
  const [messages, setMessages] = useState({});
  // 新增聊天室 Modal 的開關
  const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
  // 是否正在「進入房間」的狀態
  const [isEnteringRoom, setIsEnteringRoom] = useState(false);

  // 使用者資料（只留需要用的欄位即可，用來加入或離開聊天室）
  const [UserData, setUserData] = useState({
    username: "",
    // 如果你只需要 username，就可以不用其他欄位
    nickName: "",
    profileContent: "",
    email: "",
    gender: "",
    vactorPath: "",
  });

  /**
   * 若沒有 token，導回登入頁
   */
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /**
   * 抓取使用者資料（若需要 username 等欄位）
   */
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

    if (token) {
      loadUserDto();
    }
  }, [token, fetchWithAuth]);

  /**
   * 抓取聊天室列表
   */
  useEffect(() => {
    const loadChats = async () => {
      try {
        // 後端 API: 取得使用者參與的所有聊天室列表
        const fetchedChats = await fetchWithAuth(
          "http://localhost:8089/home/chat/user",
          "GET"
        );
        setChats(fetchedChats);
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    if (token) {
      loadChats();
    }
  }, [token, fetchWithAuth]);

  /**
   * 點擊聊天室 -> 離開上一個房間 & 進入新房間 & 抓取聊天室的歷史訊息
   */
  const handleChatClick = async (chatId) => {
    // 如果已經有選擇過另一個聊天室，先發送「離開房間」
    if (selectedChat !== null && selectedChat !== chatId) {
      const leftRoom = {
        head: {
          type: "leaftRoom",
          timestamp: new Date(),
          condition: "1",
        },
        data: {
          username: UserData.username,
          roomId: selectedChat,
        },
      };
      sendWsMessage(leftRoom);
    }

    // 設定新的選擇
    setSelectedChat(chatId);
    // 進入房間狀態
    setIsEnteringRoom(true);

    try {
      // 後端 API: 取得此聊天室的歷史訊息
      const fetchedMessages = await fetchWithAuth(
        `http://localhost:8089/home/chat/${chatId}`,
        "GET"
      );
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  /**
   * 進入房間
   */
  useEffect(() => {
    if (isEnteringRoom && selectedChat !== null) {
      const addRoom = {
        head: {
          type: "addRoom",
          timestamp: new Date(),
          condition: "1",
        },
        data: {
          username: UserData.username,
          roomId: selectedChat,
        },
      };
      sendWsMessage(addRoom);
      setIsEnteringRoom(false);
    }
  }, [isEnteringRoom, selectedChat, UserData.username, sendWsMessage]);

  /**
   * 新增聊天室 Modal 開/關
   */
  const handleOpenAddChatModal = () => {
    setIsAddChatModalOpen(true);
  };

  const handleCloseAddChatModal = () => {
    setIsAddChatModalOpen(false);
  };

  /**
   * 當成功建立一個新聊天室後，刷新列表
   */
  const handleChatCreated = (newChat) => {
    setChats((prevChats) => [...prevChats, newChat]);
    window.location.href = "http://localhost:3000/home";
  };

  return (
    <div className="flex flex-1 h-full">
      {/* 左側：聊天室列表區塊 */}
      <div className="w-1/4 bg-blue-200 shadow-lg h-full p-4 border-r rounded-lg border-gray-200 overflow-y-auto">
        <button
          className="btn btn-primary w-full mb-4 bg-white text-blue-500 py-2 px-4 rounded-lg font-bold"
          onClick={handleOpenAddChatModal}
        >
          新增聊天室
        </button>

        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onChatClick={handleChatClick}
        />
      </div>

      {/* 中間：聊天內容區塊 */}
      <div className="flex-1 bg-gradient-to-r from-blue-200 to-emerald-200 shadow-lg h-full p-6 mx-4 rounded-lg overflow-y-auto">
        {selectedChat ? (
          <ChatWebsocket
            chatId={selectedChat}
            chatname={
              chats.find((chat) => chat.chatId === selectedChat)?.chatname ||
              "聊天室"
            }
          />
        ) : (
          <p className="text-center text-gray-500">請選擇一個聊天室開始聊天</p>
        )}
      </div>

      {/* 右側：聊天室資訊/成員列表區塊 */}
      <div className="w-1/4 bg-emerald-200 shadow-lg h-full p-4 rounded-lg overflow-y-auto">
        {selectedChat ? (
          <ChatProfile chatId={selectedChat} />
        ) : (
          <p className="text-center text-gray-500">請選擇一個聊天室以查看其資訊</p>
        )}
      </div>

      {/* 新增聊天室的 Modal */}
      <AddChat
        isOpen={isAddChatModalOpen}
        onClose={handleCloseAddChatModal}
        onChatCreated={handleChatCreated}
      />
    </div>

  );

}

export default Home;
