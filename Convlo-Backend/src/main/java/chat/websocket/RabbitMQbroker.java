package chat.websocket;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import chat.model.dto.MessageDto;
import chat.service.MessageService;

@Service
public class RabbitMQbroker {

	@Autowired
	private RabbitTemplate rabbitTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private MessageService messageService;

	@RabbitListener(queues = "SendMessageToOnlineUsersQueue")
	public void receiveMessageFromRabbitMQ(String message) throws JsonMappingException, JsonProcessingException {
		System.out.println("broker 消費者成功接收到在線者的通道訊息 : " + objectMapper.readValue(message, MessageDto.class).getMessage());
		MessageDto messageDto = objectMapper.readValue(message, MessageDto.class);
		// System.out.println(messageDto.toString());

		// messageService.addMessage(messageDto);
		Long roomId = messageDto.getReceiveChat().getChatId();
		sendMessageToRabbitMqToIsRoomId(roomId, message);

	}

	public void sendMessageToRabbitMqToIsRoomId(Long roomId, String message)
			throws JsonMappingException, JsonProcessingException {
		try {
			rabbitTemplate.convertAndSend("ChatTypeExchange", "ChatId." + roomId, message);
			System.out.println("broker 生產者的訊息 : " + objectMapper.readValue(message, MessageDto.class).getMessage()
					+ "\n準備發送到處理房間"+roomId+"的通道...");
		} catch (Exception e) {
			// 處理訊息發送異常
			System.err.println("訊息發送失敗: " + e.getMessage());
			throw new RuntimeException("Failed to send message to RabbitMQ", e);
		}
	}
}
