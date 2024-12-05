import React from 'react';

// 定義 Navbar 組件，用於顯示頁面頂部的導航欄
const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full bg-gray-600 p-4 flex justify-between items-center z-50">
    {/* 首頁按鈕 */}
    <button className="bg-gray-700 text-white rounded-full w-10 h-10 mr-4">首頁</button>
    {/* 標題文字 */}
    <span className="text-white text-xl">預設Bar</span>
    <div className="flex gap-4">
      {/* 更多按鈕 */}
      <button className="bg-gray-700 text-white rounded-full w-10 h-10">更多</button>
      {/* 通知按鈕 */}
      <button className="bg-gray-700 text-white rounded-full w-10 h-10">通知</button>
      {/* 個人按鈕 */}
      <button className="bg-gray-700 text-white rounded-full w-10 h-10">個人</button>
    </div>
  </nav>
);

export default Navbar;