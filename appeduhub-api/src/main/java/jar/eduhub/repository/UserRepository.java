package jar.eduhub.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;

import jar.eduhub.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
