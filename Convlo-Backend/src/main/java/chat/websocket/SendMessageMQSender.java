package chat.websocket;

import java.util.Set;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import chat.model.dto.MessageDto;

@Service
public class SendMessageMQSender {

	@Autowired
	private RabbitTemplate rabbitTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	// 傳送給在線人員的訊息
	public void sendMessageToRabbitMq(String message) throws JsonMappingException, JsonProcessingException {
		try {
			rabbitTemplate.convertAndSend("SendMessageExchange", "", message);
			System.out.println("生產者的訊息 : " + objectMapper.readValue(message, MessageDto.class).getMessage()
					+ "\n準備發送到處理所有會員訊息的通道...");
		} catch (Exception e) {
			// 處理訊息發送異常
			System.err.println("訊息發送失敗: " + e.getMessage());
			throw new RuntimeException("Failed to send message to RabbitMQ", e);
		}
	}

	// 傳送不在線人員的名單
	public void sendOfflineUserToRabbitMq(String OfflineUsers,String roomId)
			throws JsonMappingException, JsonProcessingException {
		try {
			rabbitTemplate.convertAndSend("SendOfflineUsersExchange", "OfflineUserList", OfflineUsers);
			System.out.println("生產者的房間"+roomId+"不在線名單訊息 : " + OfflineUsers + "\n準備發送到處理不在線名單的通道...");
		} catch (Exception e) {
			// 處理訊息發送異常
			System.err.println("訊息發送失敗: " + e.getMessage());
			throw new RuntimeException("Failed to send message to RabbitMQ", e);
		}
	}
}
