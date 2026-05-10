package jar.eduhub.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "school_class") // explicit table name, avoids reserved keyword issues
public class SchoolClass {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name; // "Form 3 East", "Grade 10A"
    
    @Column(name = "student_count")
    private int studentCount;
    
    @ManyToMany(mappedBy = "classes")
    @JsonIgnore // prevents infinite JSON recursion
    private Set<Teacher> teachers = new HashSet<>();
    
    // Constructors
    public SchoolClass() {}
    
    public SchoolClass(String name, int studentCount) {
        this.name = name;
        this.studentCount = studentCount;
    }
    
    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }
    
    public int getStudentCount() { 
        return studentCount; 
    }
    
    public void setStudentCount(int studentCount) { 
        this.studentCount = studentCount; 
    }
    
    public Set<Teacher> getTeachers() { 
        return teachers; 
    }
    
    public void setTeachers(Set<Teacher> teachers) { 
        this.teachers = teachers; 
    }
}
