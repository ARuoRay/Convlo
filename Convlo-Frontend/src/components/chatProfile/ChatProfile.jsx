import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthToken';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

function ChatProfile({ chatId }) {
  const { fetchWithAuth } = useAuth();
  const [chatInfo, setChatInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    const fetchChatInfo = async () => {
      if (!chatId) return;
      setLoading(true);
      try {
        const chatProfile = await fetchWithAuth(
          `http://localhost:8089/home/chat/${chatId}/roomProfile`,
          'GET'
        );
        setChatInfo(chatProfile);
      } catch (error) {
        console.error("無法取得聊天室資訊:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatInfo();
  }, [chatId, fetchWithAuth]);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-center">請選擇聊天室顯示其成員</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-center">載入中...</p>
      </div>
    );
  }

  if (!chatInfo) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-center">尚無聊天室資訊</p>
      </div>
    );
  }

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  let formattedDate = '';
  if (Array.isArray(chatInfo.createAt) && chatInfo.createAt.length >= 3) {
    const [year, month, day] = chatInfo.createAt;
    formattedDate = `${year}年${month}月${day}日`;
  } else {
    formattedDate = String(chatInfo.createAt);
  }

  return (
    <div className="flex flex-col h-full bg-emerald-100 p-6 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">聊天室資訊</h2>

      <div className="space-y-3 text-gray-700 mb-6">
        <p>
          <span className="font-semibold">聊天室 ID：</span>
          {chatInfo.chatId}
        </p>
        <p>
          <span className="font-semibold">聊天室名稱：</span>
          {chatInfo.chatname}
        </p>
        <p>
          <span className="font-semibold">建立日期：</span>
          {formattedDate}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-4 text-gray-800">成員列表</h3>
      {chatInfo.users && chatInfo.users.length > 0 ? (
        <div className="space-y-3">
          {chatInfo.users.map((user) => (
            <button
              key={user.username}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-emerald-50 shadow-md transition-all duration-300 hover:bg-white"
              onClick={() => handleUserClick(user)}
            >
              <div className="text-left">
                <p className="text-lg font-medium text-gray-800">
                  {user.username}
                </p>
                {user.nickName && (
                  <p className="text-sm text-gray-500">
                    ({user.nickName})
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">尚無成員</p>
      )}

      <Dialog open={isUserModalOpen} onOpenChange={handleCloseUserModal}>
        <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              使用者詳細資料
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="mt-4 space-y-4">
              {selectedUser.vactorPath && (
                <div className="flex justify-center mb-4">
                  <img
                    src={selectedUser.vactorPath}
                    alt="頭貼"
                    className="w-20 h-20 object-cover rounded-full border border-gray-300"
                  />
                </div>
              )}
              <p>
                <span className="font-semibold">用戶名稱：</span>
                {selectedUser.username}
              </p>
              {selectedUser.nickname && (
                <p>
                  <span className="font-semibold">暱稱：</span>
                  {selectedUser.nickname}
                </p>
              )}
              {selectedUser.gender && (
                <p>
                  <span className="font-semibold">性別：</span>
                  {selectedUser.gender}
                </p>
              )}
            </div>
          )}
          <DialogFooter className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleCloseUserModal}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-300 hover:bg-gray-400 h-10 px-4 py-2"
            >
              關閉
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChatProfile;
