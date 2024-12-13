package chat.service;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import chat.config.SpringConfigurator;
import chat.model.dto.MessageDto;
import chat.util.JwtUtil;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/home/chat/**", configurator = SpringConfigurator.class)
@Component
public class WebSocketServer {
	// 用來儲存聊天室的 WebSocket 連接，key 爲 chatId，value 爲該聊天室的連接列表
	private static ConcurrentHashMap<String, Set<Session>> roomSessions = new ConcurrentHashMap<>();

	@Autowired
	private MessageService messageService;

	private Session session;
	private String username;
	private String chatId;


	@OnOpen
	public void onOpen(Session session, EndpointConfig config, @PathParam("chatId") String chatId) throws IOException {
		this.session = session;
		this.chatId = chatId; // 使用 URL 中的 roomId
		System.out.println("OnOpen: 接收到 WebSocket 連線請求，chatId: " + chatId);
		
		String token = getTokenFromSession(session);
	    System.out.println("OnOpen: 獲取的 token: " + token);
		
		
		this.username = getUsername(token); // 使用 token 取得 username
		
		
		// 檢查是否已經有此使用者在此聊天室中，如果有，則移除多餘的 Session
		roomSessions.computeIfAbsent(chatId, k -> new HashSet<>());
		System.out.println("OnOpen: roomSessions 初始化完成");
		
		
		// 遍歷聊天室中的所有 session，移除多餘的 session（同一個使用者）
		Set<Session> sessions = roomSessions.get(chatId);
		sessions.removeIf(s -> s.isOpen() && s.getUserProperties().get("username").equals(username));

		// 將新的 session 添加到聊天室的 session 集合中
		session.getUserProperties().put("username", username);
		sessions.add(session);
		// System.out.println(roomSessions.toString());
		System.out.println("目前聊天室 " + chatId + " 中有 " + roomSessions.get(chatId).size() + " 人");

		// 向客戶端發送連接成功的訊息
//		MessageDto messageDto = new MessageDto(userService.findByUser(username), null, chatService.getChat(this.roomId),
//				null);
//		sendMessage(messageDto);
	}

	@OnMessage
	public void onMessage(String message, Session session) throws JsonMappingException, JsonProcessingException {

		// 使用 ObjectMapper 解析接收到的 JSON 訊息
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule()); // 為了讓LocalDateTime能夠使用
		MessageDto messageDto = objectMapper.readValue(message, MessageDto.class);
		// System.out.println(messageDto.toString());

		messageService.addMessage(messageDto);
		// System.out.println(messageDto.toString());

		// 發送訊息給當前聊天室的所有成員
		sendMessageToRoom(messageDto);
	}

	@OnClose
	public void onClose() {
		// 移除聊天室中的 session
		if (roomSessions.containsKey(chatId)) {
			roomSessions.get(chatId).remove(session);
			System.out.println("目前聊天室 " + chatId + " 中剩餘有 " + roomSessions.get(chatId).size() + " 人");
			if (roomSessions.get(chatId).isEmpty()) {
				roomSessions.remove(chatId);
			}
		}
	}

	@OnError
	public void onError(Session session, Throwable error) {
		// 處理錯誤
	    System.err.println("WebSocket 錯誤: " + error.getMessage());

		roomSessions.get(chatId).remove(session);
		error.printStackTrace();
	}

//	private void sendMessage(MessageDto messageDto) throws IOException {
//		// 先將 messageDto 轉換為 JSON 字串
//		ObjectMapper objectMapper = new ObjectMapper();
//		objectMapper.registerModule(new JavaTimeModule()); // 為了讓LocalDateTime能夠使用
//		String messageJson = objectMapper.writeValueAsString(messageDto);
//		session.getBasicRemote().sendText(messageJson);
//	}

	private void sendMessageToRoom(MessageDto messageDto) {
		// 先將 messageDto 轉換為 JSON 字串
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule()); // 為了讓LocalDateTime能夠使用
		try {
			String messageJson = objectMapper.writeValueAsString(messageDto);
			// 使用 roomId 和 JSON 訊息發送給聊天室中的所有成員
			if (roomSessions.containsKey(chatId)) {
				for (Session s : roomSessions.get(chatId)) {
					// 非同步發送訊息
					CompletableFuture.runAsync(() -> {
						try {
							s.getBasicRemote().sendText(messageJson);
						} catch (IOException e) {
							e.printStackTrace();
						}
					});
				}
			}
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}

	// 從 token 取得 userId
	private String getUsername(String token) {
//    	System.out.println(jwtUtil.parseToken(token));
		if (token != null && JwtUtil.validateToken(token)) {
			System.out.println("Token 驗證成功，userId: " + JwtUtil.getUsernameFromToken(token));
			return JwtUtil.getUsernameFromToken(token);
		}
		System.out.println("Token 驗證失敗或為空");
		return null;
	}

	// 從 Session 中取得 Token
	private String getTokenFromSession(Session session) {
		String token = session.getRequestParameterMap().get("token") != null
				? session.getRequestParameterMap().get("token").get(0)
				: "";
		return token;
	}
}