import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar2';
import Login from './components/Login2';
import Home from './components/Home4.jsx';
import Register from './components/Register';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* 確保 Navbar 在頁面的最上方，並且不會因為路由切換而消失 */}
        <Navbar />

        {/* 使用 Routes 來渲染不同頁面，給 content-container 添加 margin-top 來避免與 Navbar 重疊 */}
        <div className="content-container mt-[64px] p-4 bg-blue-100 flex-grow h-full">
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            {/* <Route path="/home/profile" element={<Profile />} />
            <Route path="/ChatContent1" element={<ChatContent1 />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
