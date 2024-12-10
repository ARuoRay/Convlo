package chat.service;

import java.util.List;
import java.util.Optional;

import chat.model.dto.ChatDto;
import chat.model.dto.ChatroomDto;
import chat.model.entity.Chat;
import chat.model.entity.Message;
import chat.model.entity.User;



public interface ChatService {

	//創建聊天室
	void createChat(ChatDto chatDto);
	
	//查詢個人所有聊天室
	List<ChatDto>findAllChatByUser(String username);
	
	//增加聊天室人員
	ChatroomDto addUserToChat(Long chatId,String username);
	
	//待開發
	//查詢聊天訊息
	//List<Message>getMessagesByChatId(Long chatId);
	
	//刪除聊天室
	ChatroomDto leaveChat(Long chatId, String username);
	
	//刪除聊天室（當人數為0時）
	void deleteChat(Long chatId);	
	
	//待開發	
	//	//搜尋聊天室訊息
	//	ChatDto getChat(String chatId);
	
}
