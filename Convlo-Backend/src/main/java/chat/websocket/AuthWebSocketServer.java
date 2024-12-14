package chat.websocket;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import chat.config.SpringConfigurator;
import chat.model.dto.ChatDto;
import chat.model.dto.MessageDto;
import chat.service.ChatService;
import chat.util.JwtUtil;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/home", configurator = SpringConfigurator.class)
@Component
public class AuthWebSocketServer {

	@Autowired
	private ChatService chatService;

	@Autowired
	private ObjectMapper objectMapper;

	private Session session;
	// 儲存每個用戶ID與對應的WebSocket session
	private static final ConcurrentHashMap<String, Session> userSession = new ConcurrentHashMap<>();
	//紀錄不在房間和未收到訊息的格式
	private static final ConcurrentHashMap<List<String>, String>MessagetoUsers=new ConcurrentHashMap<>();
	//紀錄不在線者的訊息
	private String Message;


	@OnOpen
	public void onOpen(Session session) throws IOException {
		this.session=session;
		String token = session.getRequestParameterMap().get("token").get(0);
		String username = JwtUtil.getUsernameFromToken(token);
		session.getUserProperties().put("username", username);

		// 記錄該用戶的 WebSocket 連接
		userSession.put(username, session);
		System.out.println(username + "已建立連線，目前在線人數:" + userSession.size());

		// 查詢用戶擁有的所有聊天室
		List<Long> chatRooms = chatService.findAllChatByUser(username).stream().map(ChatDto::getChatId)
				.collect(Collectors.toList());
		System.out.println(username + "所擁有的聊天室" + chatRooms);
		System.out.println(MessagetoUsers.values().size());
	}

	@OnMessage
	public void onMessage(String message, Session session) throws JsonMappingException, JsonProcessingException {
		
	}

	@OnClose
	public void onClose(Session session) {
		String username = (String) session.getUserProperties().get("username");
		System.out.println("用戶" + username + "關閉連線");
		userSession.remove(username);
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		String username = session.getPathParameters().get("username");
		System.err.println("會員 " + username + " 發生錯誤: " + throwable.getMessage());
		userSession.remove(username);
	}

	@RabbitListener(queues = "SendMessageToOfflineUsersQueue")
	public void receiveMessage(String message) {
		try {
			MessageDto messageDto=objectMapper.readValue(message, MessageDto.class);
			System.out.println("會員 "+messageDto.getSendUser().getUsername()+" 的消費者成功接收到不在線者的通道訊息 : " + messageDto.getMessage());
			this.Message=message;
		} catch (Exception e) {
			System.err.println("接收訊息處理失敗 : " + e.getMessage());
			e.printStackTrace();
		}
	}
	
	@RabbitListener(queues = "SendOfflineUsersQueue")
	public void receiveOfflineUserList(String offlineUser) {
		try {
			System.out.println("消費者成功接收到不在線者名單的通道訊息 : " + offlineUser);
//			MessagetoUsers.put(objectMapper.readValue(offlineUser, List.class), this.Message);
//			System.out.println(MessagetoUsers);
//			System.ou t.println(objectMapper.writeValueAsString(MessagetoUsers));
			SendMessage(objectMapper.readValue(offlineUser, List.class));
		} catch (Exception e) {
			System.err.println("接收訊息處理失敗 : " + e.getMessage());
			e.printStackTrace();
		}
	}

	public void SendMessage(List<String> offlineUser) {
		String username=(String)session.getUserProperties().get("username");
			for(String s:userSession.keySet()) {
				if(offlineUser.contains(s)) {
					try {
						userSession.get(s).getBasicRemote().sendText(Message);
					} catch (IOException e) {
						e.printStackTrace();
					};
				}
			}
		}

}
