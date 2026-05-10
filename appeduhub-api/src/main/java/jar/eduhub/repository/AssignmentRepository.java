package jar.eduhub.repository;


    
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jar.eduhub.entity.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByClassLevel(String classLevel);
}

