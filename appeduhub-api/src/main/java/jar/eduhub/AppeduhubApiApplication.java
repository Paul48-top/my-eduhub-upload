package jar.eduhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication

@ComponentScan(basePackages = "jar.eduhub")
public class AppeduhubApiApplication {

	public static void main(String[] args) {
	SpringApplication.run(AppeduhubApiApplication.class, args);
		
	}

}