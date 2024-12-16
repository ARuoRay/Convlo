package CustomJson;

import java.util.Random;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class CustomJson<T>{
	private Head head;
	private T data;
	
	@Data
	public class Head {
		private String type;       // 訊息類型
	    private String timestamp;  // 訊息時間戳
	    private String condition;
	} 
	
	//產生UUID
	public static String generateCondition() {
		long timestamp=System.currentTimeMillis();
		int randomNum=new Random().nextInt(10000);
		return timestamp+"-"+randomNum;
	}
}
