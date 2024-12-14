import React, { useState, useEffect, useRef, createContext, useContext, Children } from "react";
import { useAuth } from "./AuthToken";

//websocket 上下文
const WebSocketContext = createContext();


// WebSocket 連接管理服務
export const useWebsocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children}) => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [offlineMessages, setOfflineMessages] = useState([]);
  const {token}=useAuth();
  const socketRef = useRef(null); // 用 useRef 來持有 WebSocket 連接
  const [message,setMessage ]= useState({
    sendUser: {
      username:"",
      nickname:"",
      gender:""  
    },
    receiveChat: {
      chatId:0,
      chatname:"",
      createAt:[],
      creator:{
        username:"",
        nickname:"",
        gender:""
      }
    },
    message: ""
  });

  

  useEffect(() => {
    // 創建 WebSocket 連接
    const socket = new WebSocket(`ws://localhost:8089/home?token=${token}`);

    socket.onopen = () => {
      console.log("WebSocket 連接已成功建立！");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // setMessage(JSON.parse(event.data))
      console.log(message);
       setMessages((prevMessages) => [...prevMessages, messageDto.message]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket 錯誤: ", error);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`連接關閉，狀態碼: ${event.code}`);
      } else {
        console.error("WebSocket 連接異常關閉");
      }
    };

    setWs(socket);
    socketRef.current = socket; // 將 WebSocket 儲存到 ref 中

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
    
  }, [token, offlineMessages])
  
  const disconnectWebSocket=()=>{
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  return (
    <WebSocketContext.Provider value={{ disconnectWebSocket  }}>
      {children}
    </WebSocketContext.Provider>
  );
}