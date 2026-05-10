package jar.eduhub.repository;


    
import org.springframework.data.jpa.repository.JpaRepository;

import jar.eduhub.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
}

