
import React, { useState, useEffect } from "react";
import { fetchTodos, getTodo, postTodo, putTodo, deleteTodo } from '../service/home'
import { useAuth } from "../component/AuthToken";
//import "../css/modal.css";

function Profile({ isOpen, onClose, UserData, setUserData }) {
    if (!isOpen) {
        return null; //如果模擬框關閉，則不渲染內容
    }
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const{fetchWithAuth}=useAuth();
    // 處理表單變更
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...UserData, [name]: value,
        });
    };

    // 處理表單提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(UserData);

        setErrorMessage(""); // 清除錯誤消息

        try {
            // 調用 putTodo 來更新用戶數據
            const updateUser = {
                username: UserData.username,
                nickName: UserData.nickName,
                email: UserData.email,
                gender: UserData.gender,
                profileContent: UserData.profileContent,
            };

            // putTodo(updateUser);
            const profile=await fetchWithAuth('http://localhost:8089/home/profile','PUT',UserData);
            setSuccessMessage("資料已成功更新！");
            setTimeout(() => {
                setSuccessMessage(""); // 清除成功消息
                onClose();
            }, 2000);
        } catch (error) {
            setErrorMessage("更新失敗，請稍後再試！");
            console.error(error);
        }

    }
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>修改個人資料</h2>
                {errorMessage && <div id="error-message" style={{ color: "red" }}>{errorMessage}</div>}
                {successMessage && <div id="success-message" style={{ color: "green" }}>{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">會員帳號</label>
                        <input type="text" className="form-control bg-light" id="username" name="username" value={UserData.username} disabled />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nickName" className="form-label">暱稱</label>
                        <input type="text" className="form-control" id="nickName" name="nickName" value={UserData.nickName || ""} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">電子郵箱</label>
                        <input type="email" className="form-control" id="email" name="email" value={UserData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">性別</label>
                        <div>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="male"
                                name="gender"
                                value="male"
                                checked={UserData.gender === "male"}
                                onChange={handleChange}
                            />
                            <label htmlFor="male" className="form-check-label ms-2">
                                男
                            </label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="female"
                                name="gender"
                                value="female"
                                checked={UserData.gender === "female"}
                                onChange={handleChange}
                            />
                            <label htmlFor="female" className="form-check-label ms-2">
                                女
                            </label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="profileContent" className="form-label">個人簡介</label>
                        <textarea className="form-control" id="profileContent" name="profileContent" value={UserData.profileContent || ""} onChange={handleChange}
                        rows="5" // 設定行數
                        style={{ resize: "none" }} /> 
                    </div>
                    <button type="button" className="btn btn-danger" onClick={onClose}>關閉</button>
                    <button type="submit" className="btn btn-primary">提交</button>
                </form>
            </div>
        </div>
    )
}
export default Profile