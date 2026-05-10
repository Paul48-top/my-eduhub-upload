package jar.eduhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jar.eduhub.entity.SchoolClass;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    
    // JpaRepository already gives you:
    // findAll(), findById(), save(), deleteById()
    
    // Add custom queries only if needed later
    // Example: List<SchoolClass> findByNameContaining(String name);
}