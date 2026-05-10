package jar.eduhub.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jar.eduhub.entity.SchoolClass;

@Entity
@Table(name = "teachers")
public class Teacher {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String subject;

      @ManyToMany
    @JoinTable(
        name = "teacher_class",
        joinColumns = @JoinColumn(name = "teacher_id"),
        inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    @JsonIgnore // prevents infinite loop when returning JSON
    private Set<SchoolClass> classes = new HashSet<>();
    
    // Add getters and setters for classes
    public Set<SchoolClass> getClasses() {
        return classes;
    }
    
    public void setClasses(Set<SchoolClass> classes) {
        this.classes = classes;
    }
    
    
    public Teacher() {}
    
    // getters/setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
}