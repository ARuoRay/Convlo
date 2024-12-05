package chat.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
	private String username;
	private String nickName;
	private String gender;
	
	@Override
	public String toString() {
		return "UserDto [username=" + username + ", nickName=" + nickName + ", gender=" + gender + "]";
	}
	
	
}
