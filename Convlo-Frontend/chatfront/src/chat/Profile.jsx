
import React, { useState, useEffect } from "react";
import {  getTodo, putImage, putTodo } from '../service/Profile'
import { useNavigate } from "react-router-dom";
import "../css/modal.css";
import ImageUpload from "../component/ImageUpload";
import { useAuth } from "../component/AuthToken";

function Profile() {
    const navigate = useNavigate();

    const [UserData, setUserData] = useState({
        image:"",
        username: "",   
        nickName: "",
        email: "",
        gender: "",
        profileContent: "",
    });

    const [selectedImage, setSelectedImage] = useState(null); // 用於儲存選中的圖片檔案
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const{fetchWithAuth}=useAuth();

    useEffect(() => {
        // 創建一個異步函數來處理 getTodo
        const fetchData = async () => {

            try {
                // const profile = await getTodo();
                const profile = await fetchWithAuth('http://localhost:8089/home/profile','GET');
                setUserData(profile); // 更新狀態
            } catch (err) {
                setErrorMessage(err.message); // 處理錯誤
            }
        };

        fetchData(); // 調用異步函數
    }, [])

    // 處理圖片上傳成功回呼
    const handleImageUpload = (file) => {
        setSelectedImage(file);
    };

    // 處理表單變更
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...UserData, [name]: value,
        });
    };

    // 處理表單提交
    const handleSubmit = async (e) => {
        const formData = new FormData();
        formData.append("File", selectedImage);
        e.preventDefault();
        console.log(UserData);

        setErrorMessage(""); // 清除錯誤消息

        try {

           // await putImage(formData);
           // await putTodo(UserData);
           //const Image=await fetchWithAuth('http://localhost:8089/file/User/ImageUpload','PUT',formData);
           const profile=await fetchWithAuth('http://localhost:8089/home/profile','PUT',UserData);
            setSuccessMessage("資料已成功更新！");
            setTimeout(() => {
                setSuccessMessage(""); // 清除成功消息
                console.log(selectedImage);
                navigate('/home');
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
                    <ImageUpload onUpload={handleImageUpload } />
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
                    <button type="button" className="btn btn-danger me-2" onClick={() => navigate("/home/profile/updatePassword")}>修改密碼</button>
                    <button type="button" className="btn btn-danger me-2" onClick={() => navigate("/home")}>返回</button>
                    <button type="submit" className="btn btn-primary">送出</button>
                </form>
            </div>
        </div>
    )
}
export default Profile