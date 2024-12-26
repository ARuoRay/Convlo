import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { fetchTodos, getTodo, postTodo, putTodo, deleteTodo } from '../../service/updatePassword';
import { useAuth } from "../AuthToken";

function Password() {
    const navigate = useNavigate();
    const { fetchWithAuth } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState({
        oldpassword: "",
        newpassword: "",
    });

    const handChange = (e) => {
        const { name, value } = e.target;
        setPassword({
            ...password, [name]: value,
        });
    };

    const handleSubmit = async (e) => { // 處理表單提交
        e.preventDefault();
        // console.log(password);

        setErrorMessage("");//清除錯誤消息

        if (password.oldpassword === password.newpassword) {
            setErrorMessage("新密碼不能與舊密碼相同！");
            return;
        }

        try {

            // await putTodo(password);
            await fetchWithAuth('http://localhost:8089/home/profile/updatePassword', 'PUT', password);
            setSuccessMessage("密碼修改成功！");
            setTimeout(() => {
                setSuccessMessage(""); //清除成功消息
                navigate('/Login');
                localStorage.removeItem("jwtToken");
            }, 2000)

        } catch (error) {
            setErrorMessage(error.toString().substring(7));
            console.error(error);
        }
    }

    return (
        <div id="password_body" className="ms-5">
            <legend>修改密碼</legend>
            {errorMessage && <div id="error-message" style={{ color: "red" }}>{errorMessage}</div>}
            {successMessage && <div id="success-message" style={{ color: "green" }}>{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="oldpassword" className="form-label">舊密碼</label>
                    <input type="text" className="form-control" id="oldpassword" name="oldpassword" value={Password.oldpassword} onChange={handChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="newpassword" className="form-label">新密碼</label>
                    <input type="text" className="form-control" id="newpassword" name="newpassword" value={Password.newpassword} onChange={handChange} />
                </div>
                <button type="button" className="btn btn-danger me-2" onClick={() => navigate("/home")}>返回</button>
                <button type="submit" className="btn btn-primary me-5">送出</button>
            </form>
        </div>
    )
}

export default Password;