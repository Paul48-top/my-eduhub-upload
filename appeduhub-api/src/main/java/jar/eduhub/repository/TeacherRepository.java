package jar.eduhub.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jar.eduhub.entity.Teacher;
@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
} 
