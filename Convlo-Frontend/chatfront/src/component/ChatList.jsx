import React from "react"
import AddChat from "./AddChat";
import { useState } from "react";

function ChatList() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [chats, setChats] = useState([
    {
      id: 5,
      creator: {
        username: "abc"
      },
      chatname: "123",
    },
    {
      id: 5,
      creator: {
        username: "abc"
      },
      chatname: "123",
    },
  ]);

  const handleOpenModal = () => {
    setIsModalOpen(true); // 打開模態框
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 關閉模態框
  };


  return (
    <div className="pure-form">
      <fieldset>
        <legend>
          群組列表
          <button className="btn btn-primary btn-lg" onClick={handleOpenModal}>新增群組</button>
          <AddChat isOpen={isModalOpen} onClose={handleCloseModal} />
        </legend>

        <table>
          <tbody>
            {chats.map((chat) => (
              <tr key={chat.id}>
                <td style={{ padding: '10px' }}>
                  <a href={`/home/${chat.creator.username}`}>{chat.chatname}</a>
                </td>
                <td style={{ padding: '10px' }}>
                  創立者: {chat.creator.username}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>
    </div>
  );
}

export default ChatList;
