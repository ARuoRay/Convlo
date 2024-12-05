package chat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import chat.model.entity.Chat;
import chat.model.entity.User;

public interface ChatRepository extends  JpaRepository<Chat, Long>{
    // 根據聊天室名稱查找聊天室
    Optional<Chat> findByChatname(String chatname);

    // 查找某個使用者參與的所有聊天室
    List<Chat> findAllByUsersContaining(User user);

    // 查找由某個創建者創建的聊天室
    List<Chat> findAllByCreator(User creator);
}
