import React, { useState, useEffect } from "react";



function ChatList({ chats, onChatClick }) {
  return (
    <div className="pure-form">
      <fieldset>
        <legend>群組列表</legend>

        <table>
          <tbody>
            {chats.map((chat) => (
              <tr key={chat.id}>
                <td style={{ padding: "10px" }}>
                  <a onClick={() => onChatClick(chat.id)}>{chat.chatname}</a>
                </td>
                <td style={{ padding: "10px" }}>
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
