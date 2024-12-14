
import React, { useState, useEffect } from "react";
import { getImage } from "../service/Profile";

function ImagePreview({ file }) {
    const [previewSrc, setPreviewSrc] = useState(null);

    useEffect(()=>{
        const getImage=async()=>{
            try {
                const response = await getImage();
                setUserData(data); // 更新狀態
            } catch (err) {
                setErrorMessage(err.message); // 處理錯誤
            }
        }
    },[]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewSrc(e.target.result); // 設定 Data URL 作為圖片來源
            };

            reader.readAsDataURL(file); // 將文件轉換為 Data URL
        }
    }, [file]); // 當 file 改變時重新生成預覽

    return (
        <div>
            {previewSrc ? (
                <div>
                    <img
                        src={previewSrc}
                        alt="預覽"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            objectFit: "contain",
                        }}
                    />
                </div>
            ) : (
                <p>未選擇圖片</p> // 如果沒有檔案，顯示提示訊息
            )}
        </div>
    );
}

export default ImagePreview;