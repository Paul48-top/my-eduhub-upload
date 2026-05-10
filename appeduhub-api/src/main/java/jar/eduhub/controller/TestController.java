package jar.eduhub.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class TestController {
    

    @GetMapping("")
    public String home() {
        return "AppEduHub API ps running";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
    
}
