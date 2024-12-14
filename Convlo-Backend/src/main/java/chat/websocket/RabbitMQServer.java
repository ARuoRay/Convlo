package chat.websocket;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import chat.model.dto.MessageDto;

@Service
public class RabbitMQServer {

	@Autowired
	private RabbitTemplate rabbitTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	// 傳送給在房間人員的訊息
	public void sendMessageToOnlineRabbitMq(String message) throws JsonMappingException, JsonProcessingException {
		try {
			MessageDto messageDto=objectMapper.readValue(message, MessageDto.class);
			System.out.println("會員 "+messageDto.getSendUser().getUsername()+" 的生產者訊息 : " + messageDto.getMessage());
			System.out.println("準備發送到處理在房間會員訊息的通道...");
			rabbitTemplate.convertAndSend("TypeExchange", "SendMessageToOnlineUsers", message);
		} catch (Exception e) {
			// 處理訊息發送異常
			System.err.println("訊息發送失敗: " + e.getMessage());
			throw new RuntimeException("Failed to send message to RabbitMQ", e);
		}
	}
	
	// 傳送給不在房間人員的訊息
	public void sendMessageToOfflineRabbitMq(String message) throws JsonMappingException, JsonProcessingException {
		try {
			MessageDto messageDto=objectMapper.readValue(message, MessageDto.class);
			System.out.println("會員 "+messageDto.getSendUser().getUsername()+" 的生產者訊息 : " + messageDto.getMessage());
			System.out.println("準備發送到處理不在房間會員訊息的通道...");
			rabbitTemplate.convertAndSend("TypeExchange", "SendMessageToOfflineUsers", message);
		} catch (Exception e) {
			// 處理訊息發送異常
			System.err.println("訊息發送失敗: " + e.getMessage());
			throw new RuntimeException("Failed to send message to RabbitMQ", e);
		}
	}

	// 傳送不在房間人員的名單
	public void sendOfflineUserToRabbitMq(String OfflineUsers, String roomId)
			throws JsonMappingException, JsonProcessingException {
		try {
			Thread.sleep(3000);
			System.out.println("生產者的房間 " + roomId + " 不在線名單訊息 : " + OfflineUsers);
			System.out.println("準備發送到處理不在房間名單的通道...");
			rabbitTemplate.convertAndSend("TypeExchange", "OfflineUserList", OfflineUsers);
		} catch (Exception e) {
			// 處理訊息發送異常
			System.err.println("訊息發送失敗: " + e.getMessage());
			throw new RuntimeException("Failed to send message to RabbitMQ", e);
		}
	}
}
