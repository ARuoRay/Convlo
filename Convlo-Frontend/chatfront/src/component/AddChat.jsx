import React, { useState } from "react";
import { createChat } from "../service/ChatList";
import "../css/modal.css";

function AddChat({ isOpen, onClose, onChatCreated }) {
  if (!isOpen) {
    return null; // 如果模態框關閉，則不渲染內容
  }

  const [chatname, setChatname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const newChat = await createChat({ chatname });
      setSuccessMessage("聊天室創建成功！");
      setTimeout(() => {
        setSuccessMessage("");
        onChatCreated(newChat); // 通知父組件新增聊天室
        onClose(); // 關閉模態框
      }, 1000);
    } catch (error) {
      setErrorMessage("創建失敗：" + error.message);
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
    <h2 className="text-xl font-bold mb-4 text-center">新增聊天室</h2>
    {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
    {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="chatname" className="block text-sm font-medium text-gray-700">
          聊天室名稱
        </label>
        <input
          type="text"
          id="chatname"
          name="chatname"
          value={chatname}
          onChange={(e) => setChatname(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          關閉
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          提交
        </button>
      </div>
    </form>
    <button
      type="button"
      onClick={onClose}
      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
    >
      &#x2715;
    </button>
  </div>
</div>

  );
}

export default AddChat;
