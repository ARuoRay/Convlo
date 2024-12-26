import React, { useState } from 'react';

const UploadImage = ({ image, setImage }) => {
  // const [image, setImage] = useState(null); // 儲存上傳後的圖片 URL
  const [loading, setLoading] = useState(false); // 上傳過程中的狀態


  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // 獲取用戶選擇的文件
    const imageHash = await calculateImageHash(file);
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file); // 新增檔案到請求
    formData.append('upload_preset', 'WengRuiHao'); // 替換為 Cloudinary 預設
    formData.append('public_id', imageHash); // 使用雜湊值作為 public_id

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dwnpu8zuq/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      setImage(data.secure_url); // 儲存圖片 URL
      setLoading(false);
    } catch (error) {
      console.error('Error uploading the image:', error);
      setLoading(false);
    }
  };

  // 計算圖片的雜湊值（可以使用 MD5、SHA1 等方式）
  const calculateImageHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', buffer); // 使用 SHA-256 計算雜湊值
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={loading}
      />
      {loading && <p>Uploading...</p>}
      {image && (
        <div>
          <p>圖片預覽</p>
          <img src={image} alt="Uploaded" style={{ width: '100px' }} />
        </div>
      )}
    </div>
  );
};

export default UploadImage;