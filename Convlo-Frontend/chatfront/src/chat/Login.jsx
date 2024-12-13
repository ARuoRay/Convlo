import React from "react";
import { useState } from "react";
import { fetchTodos, postTodo, putTodo, deleteTodo } from '../service/Logintodo';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Login.css'
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();



    // 處理表單提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        // 假設簡單的驗證
        if (!username || !password) {
            setErrorMessage("請輸入會員帳號和密碼");
            return;
        }

        const user = {
            username: username,
            password: password,

        }

        //console.log(user);
        //將資料丟後端去做比對
        try {
            const response = await postTodo(user);
            console.log(response);
            localStorage.setItem('jwtToken', response);
            navigate('/home');

            // 清空錯誤訊息
            setErrorMessage("");
        } catch (error) {

            setErrorMessage(error.message);
            console.log('網路錯誤:', error.message);
        }




    };

    return (
        <div id="login_body" className="ms-5">
            <form onSubmit={handleSubmit}>
                <fieldset >
                    <legend>🎫Login</legend>
                    {errorMessage && <div id="error-message" style={{ color: "red" }}>{errorMessage}</div>}
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">會員帳號</label>
                        <input type="text" className="form-control" id="username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">會員密碼</label>
                        <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary me-5">送出</button>
                    <a href="./Register">註冊會員</a>
                </fieldset>
            </form>
        </div>
    );
}

export default Login