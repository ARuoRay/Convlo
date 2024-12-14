import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // 正确导入 Router 和 Route
import Login from './chat/Login';
import Home from './chat/Home';
import Register from './chat/Register';
import Profile from './chat/Profile';
import Password from './chat/Password';
import { AuthProvider } from './component/AuthToken';

function App() {
  return (
    <Router>  {/* 使用 BrowserRouter */}
      <AuthProvider>
        <Routes>
          <Route path="/Register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/profile/updatePassword" element={<Password />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
