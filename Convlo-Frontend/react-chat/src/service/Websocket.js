class WebSocket {
    constructor(url) {
        if (WebSocket.instance) {
            return WebSocket.instance;
        }

        this.socket = new window.WebSocket(url);  // 使用原生 WebSocket 類
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage.bind(this); // 綁定 this
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;

        this.messageCallbacks = [];
        this.isOpen = false; // 添加一個標誌位
        WebSocket.instance = this;
    }

    

    onOpen = (event) => {
        console.log("WebSocket 連接已開啟",event);
        this.isOpen = true; // 連接開啟時更新標誌位
    };

    onMessage = (event) => {
        console.log("收到訊息:", event.data);
       
    };

    onClose = (event) => {
        console.log("WebSocket 連接關閉",event);
    };

    onError = (error) => {
        console.log("WebSocket 錯誤: ", error);
    };

    connect(roomId) {
        if (this.socket.readyState === window.WebSocket.OPEN) {
            console.log(`已連接到 ${roomId}`);
        } else {
            console.log("WebSocket 尚未開啟");
        }
    }

    sendMessage(message) {
        if (this.isOpen) {
            this.socket.send(message);
        } else {
            console.error("WebSocket 尚未開啟，無法發送訊息");
        }
    }

    onMessage(callback) {
        this.callbacks.push(callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            WebSocket.instance = null;
        }
    }
}

export default WebSocket;