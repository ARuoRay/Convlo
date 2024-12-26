import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../AuthToken";
import { useWebsocket } from "../AuthWebsocket";
import { leaveChat, addUserToChat } from "../../service/ChatList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

function ChatWebsocket({ chatname, chatId }) {
  const { token, fetchWithAuth } = useAuth();
  const { sendWsMessage, wsMessages } = useWebsocket();
  const messageContainerRef = useRef(null);

  // ---------- 1. 當前聊天室「歷史訊息」(從後端抓一次) ----------
  const [historyMessages, setHistoryMessages] = useState([]);

  // ---------- 2. 使用者資訊、聊天室資訊 ----------
  const [sendUser, setSendUser] = useState({
    username: "",
    nickname: "",
    gender: "",
    vactorPath: "",
  });
  const [receiveChat, setReceiveChat] = useState({
    chatId: "",
    chatname: "",
    createAt: "",
    creator: {},
  });

  // ---------- 3. UI狀態：送訊息框、彈窗、捲動 ----------
  const [messageInput, setMessageInput] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isLeaveChatModalOpen, setIsLeaveChatModalOpen] = useState(false);
  const [usernameToAdd, setUsernameToAdd] = useState("");
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // 若沒有 token，導向登入頁
  if (!token) {
    window.location.href = "/login";
  }

  /**
   * -------------------------
   * 第一步：載入「歷史訊息」+「當前用戶 / 聊天室資訊」
   * -------------------------
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 1) 當前用戶資料
        const profile = await fetchWithAuth("http://localhost:8089/home/chat", "GET");
        setSendUser(profile);

        // 2) 聊天室資料 (ID、名稱等)
        const chatProfile = await fetchWithAuth(
          `http://localhost:8089/home/chat/${chatId}/profile`,
          "GET"
        );
        setReceiveChat(chatProfile);

        // 3) 聊天室「歷史」訊息
        const chatHistory = await fetchWithAuth(
          `http://localhost:8089/home/chat/${chatId}`,
          "GET"
        );
        setHistoryMessages(chatHistory || []);

        // 確保在設置歷史消息後立即滾動到底部
        requestAnimationFrame(() => {
          const container = messageContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      } catch (error) {
        console.error("載入資料失敗:", error);
      }
    };
    loadInitialData();
  }, [chatId, fetchWithAuth]);

  /**
   * -------------------------
   * 第二步：篩選「只屬於當前聊天室」的 WebSocket 新訊息
   * -------------------------
   */
  const newMessages = useMemo(() => {
    return wsMessages.filter((m) => m.receiveChat.chatId === chatId);
  }, [wsMessages, chatId]);

  /**
   * -------------------------
   * 第三步：合併「歷史訊息」與「新訊息」
   * -------------------------
   */
  const mergedMessages = useMemo(() => {
    return [...historyMessages, ...newMessages];
  }, [historyMessages, newMessages]);

  /**
   * -------------------------
   * 滾動控制邏輯
   * -------------------------
   */
  // 監聽滾動事件
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 200;
      setShouldScrollToBottom(isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 處理新消息時的滾動
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container && shouldScrollToBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [mergedMessages, shouldScrollToBottom]);

  // 歷史消息載入後的初始滾動
  useEffect(() => {
    if (historyMessages.length > 0) {
      const container = messageContainerRef.current;
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
    }
  }, [historyMessages]);

  /**
   * -------------------------
   * 發送訊息
   * -------------------------
   */
  const sendMessage = () => {
    if (!sendUser.username) {
      alert("用戶資料尚未載入，請稍後再試！");
      return;
    }
    const trimmed = messageInput.trim();
    if (!trimmed) {
      return;
    }

    const sendMessageData = {
      head: {
        type: "sendMessage",
        timestamp: new Date(),
        condition: "1",
      },
      data: {
        sendUser: sendUser,
        receiveChat: receiveChat,
        message: trimmed,
      },
    };
    sendWsMessage(sendMessageData);
    setMessageInput("");
    setShouldScrollToBottom(true);
  };

  /**
   * -------------------------
   * 點擊「添加人員」
   * -------------------------
   */
  const handleAddUserButtonClick = () => {
    const addRoom = {
      head: {
        type: "addRoom",
        timestamp: new Date(),
        condition: "1",
      },
      data: {
        username: sendUser.username,
        roomId: receiveChat.chatId,
      },
    };
    sendWsMessage(addRoom);
    setIsAddUserModalOpen(true);
  };

  /**
   * -------------------------
   * 「添加人員」對話框提交
   * -------------------------
   */
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!usernameToAdd.trim()) {
      alert("請輸入要添加的使用者名稱");
      return;
    }
    try {
      await addUserToChat(receiveChat.chatId, usernameToAdd.trim());
      alert("成功添加使用者：" + usernameToAdd);
      setUsernameToAdd("");
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error("無法將使用者加入聊天室:", error);
      alert("添加使用者失敗！");
    }
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setUsernameToAdd("");
  };

  /**
   * -------------------------
   * 點擊「退出聊天室」
   * -------------------------
   */
  const handleLeaveChatButtonClick = () => {
    setIsLeaveChatModalOpen(true);
  };

  /**
   * -------------------------
   * 確認「退出聊天室」
   * -------------------------
   */
  const handleLeaveChatConfirm = async () => {
    const leftRoom = {
      head: {
        type: "leftRoom",
        timestamp: new Date(),
        condition: "1",
      },
      data: {
        username: sendUser.username,
        roomId: receiveChat.chatId,
      },
    };
    sendWsMessage(leftRoom);

    try {
      await leaveChat(receiveChat.chatId, sendUser.username);
      window.location.href = "http://localhost:3000/home";
    } catch (error) {
      console.error("無法離開聊天室:", error);
    }
  };

  const handleCloseLeaveChatModal = () => {
    setIsLeaveChatModalOpen(false);
  };

  return (
    <div className="w-full h-full bg-sky-100 rounded-lg shadow-lg p-6 flex flex-col space-y-4">
      {/* 頂部標題和按鈕 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {chatname || "聊天室"}
        </h2>
        <div className="flex space-x-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            onClick={handleAddUserButtonClick}
          >
            添加人員
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            onClick={handleLeaveChatButtonClick}
          >
            退出聊天室
          </button>
        </div>
      </div>

      {/* 消息列表容器 */}
      <div
        ref={messageContainerRef}
        className="h-full flex-1 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-sky-50"
      >
       {mergedMessages.map((msg, index) => {
  const isMe = msg.sendUser?.username === sendUser.username;
  return (
    <div
      key={index}
      className={`relative flex mb-0 w-fit max-w-[80%] ${
        isMe ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      {/* 頭像中線容器 - 作為參考線 */}
      <div className="relative flex-shrink-0" style={{ width: "48px" }}>
        {/* 隱形的中線 */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: "1px" }} />
        
        {/* 頭像 - 置中於中線 */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full overflow-hidden"
          style={{ width: "48px", height: "48px" }}
        >
          <img
            src={msg.sendUser?.vactorPath || "/default-avatar.png"}
            alt="頭像"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 消息內容區 */}
      <div className={` flex flex-col justify-center ${isMe ? 'mr-2' : 'ml-2'} py-2`}>
        {/* 用戶名 - 位於中線上方 */}
        <div className={`min-h-[20px] ${isMe ? "text-right" : "text-left"}`}>
          {!isMe && (
            <span className="text-sm text-gray-600 block">
              {msg.sendUser?.username}
            </span>
          )}
        </div>

        {/* 消息氣泡 - 位於中線下方 */}
        <div
          className={`mt-1 p-3 rounded-xl shadow-md break-words max-w-md ${
            isMe
              ? "bg-gradient-to-r from-teal-200 to-teal-200 rounded-tr-none"
              : "bg-white rounded-tl-none"
          }`}
        >
          <span className="text-base">{msg.message}</span>
        </div>
      </div>
    </div>
  );
})}
      </div>

      {/* 發送消息輸入框 */}
      <div className="flex">
        <input
          className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="請輸入訊息..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-r-full 
          hover:bg-blue-600 shadow-md transition-colors"
          onClick={sendMessage}
        >
          發送
        </button>
      </div>

      {/* 添加人員對話框 */}
      <Dialog open={isAddUserModalOpen} onOpenChange={handleCloseAddUserModal}>
        <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              添加使用者到聊天室
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddUserSubmit} className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium leading-none"
                >
                  使用者名稱
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={usernameToAdd}
                  onChange={(e) => setUsernameToAdd(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm 
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="請輸入使用者名稱"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-center space-x-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md 
                text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 
                h-10 px-4 py-2"
              >
                確認
              </button>
              <button
                type="button"
                onClick={handleCloseAddUserModal}
                className="inline-flex items-center justify-center rounded-md 
                text-sm font-medium bg-gray-300 hover:bg-gray-400 
                h-10 px-4 py-2"
              >
                取消
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  
      {/* 退出聊天室對話框 */}
      <Dialog open={isLeaveChatModalOpen} onOpenChange={handleCloseLeaveChatModal}>
        <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              確定退出聊天室？
            </DialogTitle>
          </DialogHeader>
  
          <DialogFooter className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleLeaveChatConfirm}
              className="inline-flex items-center justify-center rounded-md 
              text-sm font-medium bg-red-500 text-white hover:bg-red-600 
              h-10 px-4 py-2"
            >
              確定
            </button>
            <button
              type="button"
              onClick={handleCloseLeaveChatModal}
              className="inline-flex items-center justify-center rounded-md 
              text-sm font-medium bg-gray-300 hover:bg-gray-400 
              h-10 px-4 py-2"
            >
              取消
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
  
  
  
  
  
  
  
}  

export default ChatWebsocket;
