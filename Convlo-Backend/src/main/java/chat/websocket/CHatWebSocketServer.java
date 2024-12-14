package chat.websocket;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import chat.config.SpringConfigurator;
import chat.model.dto.MessageDto;
import chat.service.ChatService;
import chat.service.MessageService;
import chat.util.JwtUtil;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/home/chat/{roomId}", configurator = SpringConfigurator.class)
@Component
public class CHatWebSocketServer {

	@Autowired
	private RabbitMQServer RabbitMQServer;

	@Autowired
	private ChatService chatService;

	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private MessageService messageService;

	// 用來統一管理所有連接的 session
	private static final ConcurrentHashMap<String, ConcurrentHashMap<String, Session>> roomSessions = new ConcurrentHashMap<>();
	private static final Set<String> OnlineUsers = new HashSet<>();
	private Session session;

	@OnOpen
	public synchronized void onOpen(Session session, @PathParam("roomId") String roomId) throws IOException {
		String token = session.getRequestParameterMap().get("token").get(0);
		String username = JwtUtil.getUsernameFromToken(token);
		this.session = session;

		session.getUserProperties().put("roomId", roomId);
		session.getUserProperties().put("username", username);

		// 確保房間存在，並添加用戶 Session
		roomSessions.compute(roomId, (room, sessions) -> {// 使用 `compute` 來確保操作原子性
			if (sessions == null) {
				sessions = new ConcurrentHashMap<>();
			}
			sessions.put(username, session);
			return sessions;
		});
		OnlineUsers.add(username);

		System.out.println(username + "加入到房間" + roomId);
		System.out.println("目前聊天室 " + roomId + " 中有 " + roomSessions.get(roomId).size() + " 人");
	}

	@OnMessage
	public void onMessage(String message, Session session) throws JsonMappingException, JsonProcessingException {
		// 使用 RabbitMqSender 發送消息
		String roomId = (String) session.getUserProperties().get("roomId");
		Set<String> AllUsers = chatService.findAllUserByChat(roomId).stream().map(user -> user.getUsername())
				.collect(Collectors.toSet());

		Set<String> offlineUsers = new HashSet<>(AllUsers);
		offlineUsers.removeIf(OnlineUsers::contains);
		RabbitMQServer.sendMessageToOnlineRabbitMq(message);
		if (!offlineUsers.isEmpty()) {
			RabbitMQServer.sendMessageToOfflineRabbitMq(message);
			RabbitMQServer.sendOfflineUserToRabbitMq(objectMapper.writeValueAsString(offlineUsers), roomId);
		}
	}

	@OnClose
	public void onClose(Session session) {
		// 當連接關閉時，從 roomSessions 中移除該 session
		String roomId = (String) session.getUserProperties().get("roomId");
		String username = (String) session.getUserProperties().get("username");
		OnlineUsers.remove(username);
		roomSessions.compute(roomId, (room, sessions) -> {// 使用 `compute` 保證原子性
			// 初次檢查，避免 sessions 為 null
			if (sessions == null) {
				System.out.println("房間 " + roomId + " 不存在，無需關閉連接");
				return null;
			}

			sessions.remove(username);
			System.out.println("連接關閉: " + username);
			System.out.println("目前聊天室 " + roomId + " 中剩餘 " + sessions.size() + " 人");
			return sessions.isEmpty() ? null : sessions;// 如果該房間沒有成員，則移除該房間
		});
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		String roomId = (String) session.getUserProperties().get("roomId");
		String username = (String) session.getUserProperties().get("username");
		OnlineUsers.remove(username);
		if (session != null && username != null) {
			roomSessions.compute(roomId, (room, sessions) -> {
				sessions.remove(username);
				System.err.println("會員 " + username + " 發生錯誤: " + throwable.getMessage());
				System.err.println("連接關閉: " + username);
				return sessions;
			});
		}
	}

	// 發送消息到特定房間
	@RabbitListener(queues = "SendMessageToOnlineUsersQueue")
	public void SendMessage(String message) throws JsonMappingException, JsonProcessingException {
		String roomId = session.getPathParameters().get("roomId");
		MessageDto messageDto = objectMapper.readValue(message, MessageDto.class);
//		messageService.addMessage(messageDto); //將訊息保存在資料庫
		System.out.println(
				"會員 " + messageDto.getSendUser().getUsername() + " 的消費者成功接收到在房間人員的通道訊息 : " + messageDto.getMessage());
		if (roomSessions.containsKey(roomId)) {
			for (Session s : roomSessions.get(roomId).values()) {
				try {
					s.getBasicRemote().sendText(message);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}

	// 發送消息到所有房間(開發給後台使用)
	public void sendMessageToAllRooms(String message) {
		for (ConcurrentHashMap<String, Session> sessions : roomSessions.values()) {
			for (Session s : sessions.values()) {
				try {
					s.getBasicRemote().sendText(message);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

}
