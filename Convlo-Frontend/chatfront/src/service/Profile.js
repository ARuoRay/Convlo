/**
 * WEB API TodoList Rest CRUD
 * ------------------------------------------------------------
 * GET    "http://localhost:8080/todolist/"     獲取所有待辦事項
 * POST   "http://localhost:8080/todolist/"     資料送後台待辦事項
 * PUT    "http://localhost:8080/todolist/{id}" 更新待辦事項
 * DELETE "http://localhost:8080/todolist/{id}" 刪除待辦事項
 * ------------------------------------------------------------
 * */
const BASE_URL = 'http://localhost:8089/home/profile';

// 獲取待辦事項
export const getTodo = async () => {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (result.status === 200) {
        return result.data; // 返回資料 json 給 then(json) 接收
    }
    throw new Error(result.message);
};


// 更新待辦事項
export const putTodo = async (updateTodo) => {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateTodo),
    });
    const result = await response.json();
    if (result.status === 200) {
        return result.data; // 返回資料
    }
    throw new Error(result.message);
};

export const putImage = async (FormData) => {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost:8089/file/User/ImageUpload', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: FormData,
    });
    const result=await response.json();
    if(result.status===200){
        return result.data; // 返回資料
    }
    throw new Error(result.message);
}

export const getImage= async(FormData) =>{
    const token=localStorage.getItem('jwtToken');
    const response=await fetch('http://localhost:8089/file/User/ImageUpload',{
        method:'GET',
        headers:{
            'Authorization': `Bearer ${token}`,
        },
        body: FormData,
    });
    const result=await response.json();
    if(result.status===200){
        return result.data; // 返回資料
    }
    throw new Error(result.message);
}

