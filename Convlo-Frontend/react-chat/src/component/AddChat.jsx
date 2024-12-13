
import React, { useState, useEffect } from "react";
import { fetchTodos, getTodo, postTodo, putTodo, deleteTodo } from '../service/home'
import "../css/modal.css";

function AddChat({ isOpen, onClose}) {
    if (!isOpen) {
        return null; //如果模擬框關閉，則不渲染內容
    }
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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

            putTodo(updateUser);
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
                <h2>新增群組</h2>
                {errorMessage && <div id="error-message" style={{ color: "red" }}>{errorMessage}</div>}
                {successMessage && <div id="success-message" style={{ color: "green" }}>{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    
                    <button type="button" className="btn btn-danger" onClick={onClose}>關閉</button>
                    <button type="submit" className="btn btn-primary">提交</button>
                </form>
            </div>
        </div>
    )
}
export default AddChat