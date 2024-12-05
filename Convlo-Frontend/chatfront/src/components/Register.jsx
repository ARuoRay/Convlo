import React, { useEffect } from "react";
//import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/Register.css';
import { useState } from "react";
import { fetchTodos, postTodo, putTodo, deleteTodo } from '../service/Registertodo';
import { useNavigate } from "react-router-dom";


function Register() {

    const [RegisterData, setRegisterData] = useState({
        username: "",
        password: "",
        email: "",
        gender: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [AllUsers,setAllUsers]=useState([]);
    const navigate = useNavigate();

    //獲取所有會員資料
    useEffect(()=>{
        console.log('抓取資料成功');
        fetchTodos()
        .then(data=>setAllUsers(data))
        .catch((error) => console.error('error:', error));
    },[])


    // 處理表單變更
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...RegisterData, [name]: value,
        });
    };

    // 處理表單提交
    const handleSubmit =  async(e) => {
        e.preventDefault();
        console.log(AllUsers);
        // 簡單的表單驗證
        if (!RegisterData.username || !RegisterData.password || !RegisterData.email || !RegisterData.gender) {
            setErrorMessage("所有欄位都必須填寫");
            return;
        }

        if(AllUsers.some(user=>user.username===RegisterData.username)){
            setErrorMessage("會員帳號已存在!請重新註冊");
            return;
        }

        // 假設成功註冊
        setSuccessMessage("註冊成功！");
        setErrorMessage(""); // 清除錯誤訊息
        navigate('/Login'); // 跳轉回登入頁面

        console.log(RegisterData);
        try {
            await postTodo(RegisterData);
        } catch (error) {
            console.log('網路錯誤:', error.message);
        }
    };



    return (

        <div id="login_body">
            <fieldset>
                <legend>註冊會員</legend>
                {errorMessage && <div id="error-message" style={{color:"red"}}>{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">會員帳號</label>
                        <input type="text" className="form-control" id="username" name="username" value={RegisterData.username} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">會員密碼</label>
                        <input type="password" className="form-control" id="password" name="password" value={RegisterData.password} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">電子郵箱</label>
                        <input type="email" className="form-control" id="email" name="email" value={RegisterData.email} onChange={handleChange} />
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
                                checked={RegisterData.gender === "male"}
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
                                checked={RegisterData.gender === "female"}
                                onChange={handleChange}
                            />
                            <label htmlFor="female" className="form-check-label ms-2">
                                女
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">註冊</button>
                </form>
            </fieldset>
        </div >

    );
};

export default Register;