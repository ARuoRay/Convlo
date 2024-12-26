import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/home/Navbar.jsx";
import Login from "./components/login/Login.jsx";
import Home from "./components/home/Home.jsx";
import Register from "./components/login/Register";
import Forget from "./components/login/Forget.jsx";
import Password from "./components/Password.jsx";
import "./index.css";
import { AuthProvider } from "./components/AuthToken.jsx";
import { WebSocketProvider } from "./components/AuthWebsocket.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <div className="relative h-screen w-screen flex flex-col overflow-hidden">
            {/* 固定區塊：Navbar */}
            <div className="fixed top-0 left-0 right-0 h-16 z-50 shadow-md  bg-gray-800">
              <Navbar />
            </div>

            {/* 內容區域 */}
            <div className="pt-16 flex-1 flex justify-center bg-gradient-to-r from-blue-100 to-teal-100 overflow-auto">
              {/* Container */}
              <div className="w-full mx-6 my-6 p-4 bg-gradient-to-r from-blue-300 to-emerald-300 rounded-lg  shadow-lg">
                <Routes>
                  <Route path="/Login" element={<Login />} />
                  <Route path="/Register" element={<Register />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/forget" element={<Forget />} />
                  <Route path="/Login/password" element={<Password />} />
                </Routes>
              </div>
            </div>
          </div>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}


export default App;
