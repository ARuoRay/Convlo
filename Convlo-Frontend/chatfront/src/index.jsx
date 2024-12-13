import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar2.jsx';
import Login from './components/Login2.jsx';
import './index.css';

// 定義主應用程式 App
const App = () => (
  <div>
    {/* 導航欄組件 */}
    <Navbar />
    {/* 登入組件 */}
    <Login />
  </div>
);


export default App
