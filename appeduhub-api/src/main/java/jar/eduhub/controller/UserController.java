package jar.eduhub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")  // or just "/user"
public class UserController {

    @GetMapping
    public List<String> getUsers() {
        return List.of("Test User 1", "Test User 2");
    }
}