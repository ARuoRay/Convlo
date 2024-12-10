import React, { useEffect, useState } from "react";
import ChatList from "../component/ChatList2";
import ChatContent from "../component/ChatContent2";
import Profile from "./Profile";
import AddChat from "../component/AddChat";
import { fetchAllChats,fetchMessages } from "../service/ChatList";
import { useNavigate } from "react-router-dom";

function Home() {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const [UserData, setUserData] = useState({
    username: "",
    nickName: "",
    profileContent: "",
    email: "",
    gender: "",
  });

  const [messages, setMessages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  // 獲取聊天室列表
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadChats = async () => {
      try {
        const fetchedChats = await fetchAllChats();
        setChats(fetchedChats);
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    loadChats();
  }, [token, navigate]);

  const handleChatClick = async (chatId) => {
    console.log("Selected Chat ID:", chatId); // 確認 chatId
    setSelectedChat(chatId);
    try {
      const fetchedMessages = await fetchMessages(chatId);
      console.log("我的fetch拿到"+chatId)
      setMessages(fetchedMessages); // 更新消息
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }

  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenAddChatModal = () => {
    setIsAddChatModalOpen(true);
  };

  const handleCloseAddChatModal = () => {
    setIsAddChatModalOpen(false);
  };

  const handleChatCreated = (newChat) => {
    setChats((prevChats) => [...prevChats, newChat]);
  };

  return (
    <div className="flex flex-1 ">
      {/* 左側的聊天室列表區塊 */}
      <div className="w-1/4 bg-gray-50 shadow-lg max-h-[80vh] p-4 border-r border-gray-200 h-full overflow-y-auto">
      <button
          className="btn btn-primary w-full mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
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

      {/* 中間的聊天內容區塊 */}
      <div className="flex-1 bg-white shadow-lg p-6 mx-4 rounded-lg ">
      <div className="bg-gray-100 shadow-md p-6 rounded-lg h-full">
          {selectedChat ? (
            <ChatContent chatId={selectedChat} chatname={chats.find(chat => chat.chatId === selectedChat)?.chatname || "聊天室"} messages={messages} />
        ) : (
            <p className="text-center text-gray-500">請選擇一個聊天室開始聊天</p>
          )}
        </div>
      </div>

      {/* 右側的聊天對象資訊區塊 */}
      <div className="w-1/4 bg-white shadow-lg p-4 ">
      {selectedChat ? (
          <Profile
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            UserData={UserData}
            setUserData={setUserData}
          />
        ) : (
          <p className="text-center text-gray-500">
            請選擇一個聊天室以查看對象資訊
          </p>
        )}
        <button
          className="btn btn-primary btn-lg mt-4 w-full"
          onClick={handleOpenModal}
        >
          修改個人資料
        </button>
      </div>

      {/* 新增聊天室模態框 */}
      <AddChat
        isOpen={isAddChatModalOpen}
        onClose={handleCloseAddChatModal}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
}

export default Home;
