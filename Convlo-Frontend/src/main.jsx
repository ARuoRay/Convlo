import React from 'react';
import ReactDOM from 'react-dom/client';  // 正确导入 ReactDOM
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
