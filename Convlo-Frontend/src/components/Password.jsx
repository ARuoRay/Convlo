import React, { useEffect, useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchTodos, getTodo, postTodo, putTodo, deleteTodo } from '../service/updatePassword';
import { useAuth } from "../components/AuthToken";

function Password() {
    const navigate = useNavigate();
    const [readUrl] = useSearchParams();// 讀取 URL 中的 token
    const { fetchWithAuth } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState({
        password: "",
    });
    const [returnPassword, setReturnPassword] = useState("");

    useEffect(() => {
        const token = readUrl.get("token");
        // console.log(token);
        localStorage.setItem('jwtToken', token);
    }, [])

    // const handChange=(e)=>{
    //     const{name,value}=e.target;
    //     setPassword({
    //         ...password,[name]:value,
    //     });
    //     setReturnPassword({
    //         ...returnPassword,returnPassword,
    //     });
    // };

    const handleSubmit = async (e) => { // 處理表單提交
        e.preventDefault();
        // console.log(password);

        setErrorMessage("");//清除錯誤消息

        if (password.password !== returnPassword) {
            setErrorMessage("新密碼和確認新密碼不相同！");
            return;
        }

        try {

            // await putTodo(password);
            console.log(password);

            await fetchWithAuth('http://localhost:8089/Login/password', 'PUT', password);
            setSuccessMessage("密碼修改成功！");
            setTimeout(() => {
                setSuccessMessage(""); //清除成功消息
                localStorage.removeItem('jwtToken');
                navigate('/Login');
            }, 2000)

        } catch (error) {
            setErrorMessage(error.toString().substring(7));
            console.error(error);
        }
    }

    return (
        <div id="password_body" className="ms-5 p-5">
            <legend>修改密碼</legend>
            {errorMessage && <div id="error-message" style={{ color: "red" }}>{errorMessage}</div>}
            {successMessage && <div id="success-message" style={{ color: "green" }}>{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">密碼</label>
                    <input type="text" className="form-control" id="password" name="password" value={password.password} onChange={(e) => setPassword({ ...password, password: e.target.value })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="returnPassword" className="form-label">確認新密碼</label>
                    <input type="text" className="form-control" id="returnPassword" name="returnPassword" value={returnPassword} onChange={(e) => setReturnPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary me-5">送出</button>
            </form>
        </div>
    )
}

export default Password;