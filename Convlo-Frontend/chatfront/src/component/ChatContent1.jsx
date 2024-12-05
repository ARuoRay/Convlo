import React, { useState, useEffect } from 'react';
import WebSocket from '../service/Websocket';

function ChatContent1({ chats }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [currentRoom, setCurrentRoom] = useState('room1');
    const [socketService, setSocketService] = useState(null);



    // 僅初始化一次 WebSocketService
    useEffect(() => {
        console.log("Starting WebSocket...");
        const wsService = new WebSocket(`ws://localhost:8089/home/${currentRoom}`);



        wsService.onMessage((event) => {
            console.log('Received raw message:', event.data);

            setMessages((prevMessages) => [...prevMessages, event.data]); // 更新狀態

        });
        setSocketService(wsService);

        // 清理函數，當組件卸載時關閉 WebSocket
        return () => {
            if (wsService) {
                wsService.disconnect();
            }
        };
    }, []); // 空的依賴數組，確保只初始化一次

    useEffect(() => {
        console.log('Messages updated:', messages);
    }, [messages]);// 每次 messages 改變時觸發

    // 進入聊天室
    const joinRoom = (roomId) => {
        if (!socketService) return; // 如果 socketService 尚未初始化，直接返回
        setCurrentRoom(roomId);
        socketService.connect(roomId);  // 使用 WebSocketService 連接指定的聊天室
    };

    // 發送訊息
    const sendMessage = () => {
        if (!socketService) return; // 如果 socketService 尚未初始化，直接返回
        if (inputMessage.trim()) {
            const Newmessage = JSON.stringify({
                roomId: currentRoom,  // 使用當前房間 ID
                message: inputMessage  // 使用輸入框的訊息
            });
            socketService.sendMessage(Newmessage);  // 發送訊息
            console.log(Newmessage);
            setMessages((prevMessages) => [...prevMessages, Newmessage]);
            console.log(messages);
            // setMessages(() => [Newmessage]);
            setInputMessage('');  // 清空輸入框
        }
    };

    return (
        <div>
            <div>
                <div className="chatroom-list">
                    <h3>聊天室列表</h3>
                    <button onClick={() => joinRoom('room1')}>歡樂城台</button>
                    <button onClick={() => joinRoom('room2')}>開心台</button>
                    <button onClick={() => joinRoom('room3')}>幼兒台</button>
                </div>

                <div className="chatbox">
                    <h3>聊天室 - {currentRoom}</h3>
                    <div id="messages" style={{ height: '250px', overflowY: 'scroll' }}>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                {msg}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="輸入訊息"
                    />
                    <button onClick={sendMessage}>發送</button>
                </div>
            </div>
        </div>
    );
}

export default ChatContent1;

