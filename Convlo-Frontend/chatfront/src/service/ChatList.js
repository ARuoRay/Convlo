const BASE_URL = 'http://localhost:8089/home/chat';


// **1. 創建聊天室**
export const createChat = async (chatData) => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(chatData),
  });
  const result = await response.json();
  if (result.status === 200) {
    return result.data;
  }
  throw new Error(result.message);
};

// **2. 獲取用戶參與的所有聊天室**
export const fetchAllChats = async () => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (result.status === 200) {
    return result.data;
  }
  throw new Error(result.message);
};

// **3. 添加用戶到聊天室**
export const addUserToChat = async (chatId, username) => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch(`${BASE_URL}/addUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId, username }),
  });
  const result = await response.json();
  if (result.status === 200) {
    return result.data;
  }
  throw new Error(result.message);
};

// **4. 用戶退出聊天室**
export const leaveChat = async (chatId, username) => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch(`${BASE_URL}/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId, username }),
  });
  const result = await response.json();
  if (result.status === 200) {
    return result.data;
  }
  throw new Error(result.message);
};

// **5. 刪除聊天室（內部調用）**
export const deleteChat = async (chatId) => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch(`${BASE_URL}/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId }),
  });
  if (response.ok) {
    return true;
  }
  const result = await response.json();
  throw new Error(result.message);
};

// **6. （可選）獲取聊天室的所有消息**
export const fetchMessages = async (chatId) => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch(`${BASE_URL}/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (result.status === 200) {
    return result.data;
  }
  throw new Error(result.message);
};
