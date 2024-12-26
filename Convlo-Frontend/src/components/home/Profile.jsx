import React, { useState } from "react";
import { useAuth } from "../AuthToken";
import UploadImage from "../home/uploadImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

function Profile({ isOpen, onClose, UserData, setUserData, image, setImage }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { fetchWithAuth } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...UserData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const updateUser = {
        username: UserData.username,
        nickName: UserData.nickName,
        email: UserData.email,
        gender: UserData.gender,
        profileContent: UserData.profileContent,
        vactorPath: image,
      };

      await fetchWithAuth("http://localhost:8089/home/profile", "PUT", updateUser);
      setSuccessMessage("資料已成功更新！");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000);
    } catch (error) {
      setErrorMessage("更新失敗，請稍後再試！");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            修改個人資料
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <UploadImage image={image} setImage={setImage} />
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-600">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              會員帳號
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={UserData.username}
              disabled
              className="w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label htmlFor="nickName" className="block text-sm font-medium">
              暱稱
            </label>
            <input
              type="text"
              id="nickName"
              name="nickName"
              value={UserData.nickName || ""}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              電子郵箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={UserData.email}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">性別</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={UserData.gender === "male"}
                  onChange={handleChange}
                  className="mr-2 bg-gray-100"
                />
                男
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={UserData.gender === "female"}
                  onChange={handleChange}
                  className="mr-2 bg-gray-100"
                />
                女
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="profileContent" className="block text-sm font-medium">
              個人簡介
            </label>
            <textarea
              id="profileContent"
              name="profileContent"
              rows="4"
              value={UserData.profileContent || ""}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 mt-1 text-sm"
            />
          </div>

          <DialogFooter className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              提交
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              關閉
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;
