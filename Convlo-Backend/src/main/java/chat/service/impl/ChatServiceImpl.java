package chat.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import chat.exception.UserNotFoundException;
import chat.model.dto.ChatDto;
import chat.model.dto.ChatroomDto;
import chat.model.dto.UserDto;
import chat.model.entity.Chat;
import chat.model.entity.ChatUser;
import chat.model.entity.Message;
import chat.model.entity.User;
import chat.repository.ChatRepository;
import chat.repository.ChatUserRepository;
import chat.repository.MessageRepository;
import chat.repository.UserRepository;
import chat.service.ChatService;

@Service
public class ChatServiceImpl implements ChatService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ChatRepository chatRepository;
	
	@Autowired
	private ChatUserRepository chatUserRepository;
	
	@Autowired
	private MessageRepository messageRepository;
	
	@Autowired
	private ModelMapper modelMapper;
	
	
	
	@Override
	public void createChat(ChatDto chatDto) {
	    // 驗證聊天室名稱是否有效
	    if (chatDto.getChatname() == null || chatDto.getChatname().trim().isEmpty()) {
	        throw new IllegalArgumentException("聊天室名稱不能為空");
	    }

	    // 查詢創建者
	    User creator = userRepository.findByUsername(chatDto.getCreator().getUsername())
	            .orElseThrow(() -> new UserNotFoundException("會員不存在"));

	    // 創建 Chat 實體
	    Chat chat = new Chat();
	    chat.setChatname(chatDto.getChatname());
	    chat.setCreator(creator);

	    // 添加創建者為聊天室成員
	    List<User> users = new ArrayList<>();
	    users.add(creator);
	    chat.setUsers(users);

	    // 設置創建時間
	    chat.setCreateAt(LocalDateTime.now());

	    // 保存到數據庫
	    chatRepository.save(chat);
	}
	
//	@Override
//	public void createChat(ChatDto chatDto) {
//	    // 驗證聊天室名稱是否有效
//	    if (chatDto.getChatname() == null || chatDto.getChatname().trim().isEmpty()) {
//	        throw new IllegalArgumentException("聊天室名稱不能為空");
//	    }
//
//	    // 查詢創建者
//	    User creator = userRepository.findByUsername(chatDto.getCreator().getUsername())
//	            .orElseThrow(() -> new UserNotFoundException("會員不存在"));
//	    
//	    // 創建 Chat 實體
//	    Chat chat = new Chat();
//	    chat.setChatname(chatDto.getChatname());
//	    chat.setCreator(creator);
//	    chat.setCreateAt(LocalDateTime.now());
//
//	    // 保存到數據庫
//	    chatRepository.save(chat);
//	    
//	 // 自動映射創建者到 ChatUser 中，將創建者添加到聊天室成員中
//	    ChatUser chatUser = new ChatUser();
//	    chatUser.setChat(chat);
//	    chatUser.setUser(creator);
//	    
//	 // 保存 ChatUser 到數據庫
//	    chatUserRepository.save(chatUser);
//	}



	@Override
	public List<ChatDto> findAllChatByUser(String username) {
	    // 查詢用戶
	    User user = userRepository.findByUsername(username)
	            .orElseThrow(() -> new UserNotFoundException("會員不存在，查詢失敗"));
	    
	 // 查詢與該用戶相關的所有聊天室
	    List<Chat> chats = chatRepository.findAllByUsersContaining(user);
	    
		// 將每個 Chat 實體轉換為 ChatroomDto
	    
	    
	    return chats.stream()
	            .map(chat -> modelMapper.map(chat, ChatDto.class)) // 使用 ModelMapper 轉換
	            .toList();
	}


	@Override
	public ChatroomDto addUserToChat(Long chatId, String username) {
	    
		// 1. 查詢聊天室是否存在
	    Chat chat = chatRepository.findById(chatId)
	                  .orElseThrow(() -> new RuntimeException("聊天室不存在，無法添加用戶"));

	    // 2. 查詢使用者是否存在
	    User user = userRepository.findByUsername(username)
	                  .orElseThrow(() -> new RuntimeException("使用者不存在"));

	    // 3. 檢查用戶是否已經是聊天室成員
	    if (chat.getUsers().contains(user)) {
	        throw new RuntimeException("用戶已經是該聊天室的成員，無需重複添加");
	    }

	    // 4. 將用戶添加到聊天室
	    chat.getUsers().add(user);

	    // 5. 保存更新後的聊天室
	    Chat updatedChat = chatRepository.save(chat);
	    
	    // 6. 將 Chat 實體轉換為 ChatDto並返回
	    return convertToDto(updatedChat);
	}

	@Override
	public ChatroomDto leaveChat(Long chatId, String username) {
	    // 1. 查詢聊天室是否存在
	    Chat chat = chatRepository.findById(chatId)
	                  .orElseThrow(() -> new RuntimeException("聊天室不存在，無法移除用戶"));

	    // 2. 查詢使用者是否存在
	    User user = userRepository.findByUsername(username)
	                  .orElseThrow(() -> new RuntimeException("使用者不存在"));

	    // 3. 檢查用戶是否為聊天室成員
	    if (!chat.getUsers().contains(user)) {
	        throw new RuntimeException("使用者不在該聊天室中，無法移除");
	    }

	    // 4. 將使用者從聊天室移除
	    chat.getUsers().remove(user);

	    // 5. 如果聊天室已無成員，則刪除聊天室
	    if (chat.getUsers().isEmpty()) {
	        deleteChat(chatId);
	        return null; // 聊天室已刪除，無需返回 DTO
	    }

	    // 6. 保存更新後的聊天室
	    Chat updatedChat = chatRepository.save(chat);

	    // 7. 使用自訂的 convertToDto 方法將 Chat 實體轉換為 ChatroomDto 並返回
	    return convertToDto(updatedChat);
	}


//	@Override
//	public List<Message> getMessagesByChatId(Long chatId) {
//
//	}

	@Override
	public void deleteChat(Long chatId) {
	    // 1. 查詢聊天室是否存在
	    Chat chat = chatRepository.findById(chatId)
	                  .orElseThrow(() -> new RuntimeException("聊天室不存在"));

	    // 2. 刪除聊天室
	    chatRepository.delete(chat);
	}

  
	
	//服務層轉換Entity to Dto
	private ChatroomDto convertToDto(Chat chat) {
		// 使用 ModelMapper 進行基本映射
	    ChatroomDto chatroomDto = modelMapper.map(chat, ChatroomDto.class);

	    // 自訂映射規則：將 User 實體轉換為 UserDto
	    List<UserDto> userDtos = chat.getUsers().stream()
	            .map(user -> modelMapper.map(user, UserDto.class))
	            .toList();

	    // 設置到 ChatroomDto 的 users 字段
	    chatroomDto.setUsers(userDtos);
	    
	    //設置ChatId
	    chatroomDto.setChatId(chat.getChatId());

	    return chatroomDto;
	}

}
