import React from 'react';
import ReactDOM from 'react-dom/client';  // 正确导入 ReactDOM
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <App />
   </React.StrictMode>
);
