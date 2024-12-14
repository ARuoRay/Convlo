package chat.websocket;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.hibernate.internal.build.AllowSysOut;
import org.modelmapper.ModelMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;

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
public class WebSocketServer2 {

	@Autowired
	private SendMessageMQSender rabbitMqSender;

	@Autowired
	private ChatService chatService;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private ModelMapper modelMapper;

	// 儲存每個用戶ID與對應的WebSocket session
	private ConcurrentHashMap<String, Session> userSession = new ConcurrentHashMap<>();

	@OnOpen
	public void onOpen(Session session) throws IOException {
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
		;
	}

	@OnMessage
	public void onMessage(String message, Session session) throws JsonMappingException, JsonProcessingException {
		// 使用 RabbitMqSender 發送消息

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

	public void SendMessage(String roomId, String message) {
//		Set<String> members = chatRoom.get(roomId);
//		if (members != null) {
//			members.forEach(username -> {
//				Session session = userSession.get(username);// 查找 session
//				if (session != null && session.isOpen()) {
//					session.getAsyncRemote().sendText(message);
//				}
//			});
//		}
	}

	@RabbitListener(queues = "SendMessageToOfflineUsersQueue")
	public void receiveMessage(String message, Channel channel, Message message2) {
		try {
			System.out.println("消費者成功接收到不在線者的通道訊息 : " + objectMapper.readValue(message, MessageDto.class).getMessage());
			channel.basicReject(message2.getMessageProperties().getDeliveryTag(), false);
		} catch (Exception e) {
			System.err.println("接收訊息處理失敗 : " + e.getMessage());
			e.printStackTrace();
		}
	}
	
	@RabbitListener(queues = "SendOfflineUsersQueue")
	public void receiveOfflineUserList(String offlineUser, Channel channel, Message message2) {
		try {
			System.out.println("消費者成功接收到不在線者名單的通道訊息 : " + offlineUser);
			channel.basicReject(message2.getMessageProperties().getDeliveryTag(), false);
		} catch (Exception e) {
			System.err.println("接收訊息處理失敗 : " + e.getMessage());
			e.printStackTrace();
		}
	}

}
