import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar2';
import Login from './components/Login2';
import Home from './components/Home5.jsx';
import Register from './components/Register';
import './App.css';
import { AuthProvider } from './component/AuthToken.jsx';
import { WebSocketProvider } from './component/AuthWebsocket.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <div className="App ">
            {/* 確保 Navbar 在頁面的最上方，並且不會因為路由切換而消失 */}
            <div className='navbar p-6'>
              <Navbar />
            </div>

            {/* 使用 Routes 來渲染不同頁面，給 content-container 添加 margin-top 來避免與 Navbar 重疊 */}
            <div className="content-container p-4 bg-blue-100 flex flex-1 h-full ">
              <Routes>
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                {/* <Route path="/home/profile" element={<Profile />} />
            <Route path="/ChatContent1" element={<ChatContent1 />} /> */}
              </Routes>
            </div>
          </div>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
