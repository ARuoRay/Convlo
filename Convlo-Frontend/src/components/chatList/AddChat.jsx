import React, { useState } from "react";
import { useAuth } from "../AuthToken";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { MessageCircle, Loader2 } from "lucide-react";

function AddChat({ isOpen, onClose, onChatCreated }) {
  const { fetchWithAuth } = useAuth();
  const [chatname, setChatname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const newChat = await fetchWithAuth('http://localhost:8089/home/chat', 'POST', { chatname });
      setSuccessMessage("聊天室創建成功！");
      setTimeout(() => {
        setSuccessMessage("");
        onChatCreated(newChat);
        onClose();
      }, 1000);
    } catch (error) {
      setErrorMessage("創建失敗：" + error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100 shadow-lg rounded-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-xl">
            <MessageCircle className="h-5 w-5" />
            新增聊天室
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="chatname"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                聊天室名稱
              </label>
              <input
                type="text"
                id="chatname"
                value={chatname}
                onChange={(e) => setChatname(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="請輸入聊天室名稱"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  處理中...
                </>
              ) : (
                "建立聊天室"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-300 text-gray-700 hover:bg-gray-400 h-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              取消
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddChat;
