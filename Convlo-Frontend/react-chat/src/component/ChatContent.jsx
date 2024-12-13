import React, { useState } from "react";

function ChatContent({ chats }) {
    const [messages, setMessages] = useState([]); // 儲存訊息
    const [message, setMessage] = useState("");   // 當前輸入的訊息
    const [socket, setSocket] = useState(null);  // WebSocket連接


    const send = () => {
        if (message.trim()) {
            setMessages([...messages, message]);  // 新訊息加入到聊天內容
            console.log(message); 
            setMessage(""); // 發送後清空輸入框
        }
    };
    //console.log(message); // 你可以根據需求發送訊息或更新聊天視窗
    return (
        <div className="pure-form">
            <div
                style={{
                    width: "500px",
                    height: "500px",
                    border: "1px solid black",
                    backgroundColor: "darkgray",
                    overflowY: "scroll", // 讓聊天區域可以滾動
                    padding: "10px",
                    color: "white"
                }}
                id="message"
            >
                {/* 顯示聊天內容 */}
                {messages.map((msg,index)=>(
                    <div key={index}>我:{msg}</div>
                ))}
            </div>
            <div style={{ width: "500px", display:"flex"}}>
                <input
                    type="text"
                    name="text"
                    id="chatInput"
                    style={{ width: "92%" }}
                    value={message} // 關聯輸入框的值
                    onChange={(e) => setMessage(e.target.value)} // 更新輸入框內容
                />
                <button style={{ width: "50px" }} onClick={send}>發送</button>
            </div>
        </div>
    );
}

export default ChatContent;