import React, { useState } from "react";

function ImageUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // 獲取選中的檔案
    if (file) {
      setUploading(true);

      // 預覽圖片
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // const formData = new FormData();
      // formData.append("File", file);


      if (onUpload) {
        onUpload(file);
      }
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploading && <p>上傳中...</p>}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="預覽"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover", // 確保圖片不會變形
            border: "2px solid #ccc", // 可選：加邊框
          }}
        />
      )}
    </div>
  );
}

export default ImageUploader;
