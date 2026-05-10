package jar.eduhub.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jar.eduhub.dto.CreateUserRequest;
import jar.eduhub.entity.SchoolClass;
import jar.eduhub.entity.Student;
import jar.eduhub.entity.Teacher;
import jar.eduhub.entity.User;
import jar.eduhub.repository.SchoolClassRepository;
import jar.eduhub.repository.StudentRepository;
import jar.eduhub.repository.TeacherRepository;
import jar.eduhub.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository; // added this

    // Updated constructor - add SchoolClassRepository
    public AdminController(UserRepository userRepository, 
                           StudentRepository studentRepository, 
                           TeacherRepository teacherRepository,
                           SchoolClassRepository schoolClassRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.schoolClassRepository = schoolClassRepository;
    }

    @GetMapping("/test")
    public String adminTest() {
        return "Admin area is secure and working!";
    }

    // USER MANAGEMENT
    @PostMapping("/users")
    public User createUser(@RequestBody CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return userRepository.save(user);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // TEACHER MANAGEMENT
    @PostMapping("/teachers")
    public Teacher addTeacher(@RequestBody Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    @GetMapping("/teachers")
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    // STUDENT MANAGEMENT  
    @PostMapping("/students")
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // === NEW: CLASS MANAGEMENT ===
    
    // Create a class + student count
    @PostMapping("/classes")
    public SchoolClass createClass(@RequestBody SchoolClass schoolClass) {
        return schoolClassRepository.save(schoolClass);
    }

    // Get all classes
    @GetMapping("/classes")
    public List<SchoolClass> getAllClasses() {
        return schoolClassRepository.findAll();
    }

    // Assign teacher to class
    @PutMapping("/teachers/{teacherId}/assign/{classId}")
    public ResponseEntity<Teacher> assignTeacherToClass(
            @PathVariable Long teacherId, 
            @PathVariable Long classId) {
        
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow();
        SchoolClass schoolClass = schoolClassRepository.findById(classId).orElseThrow();
        
        teacher.getClasses().add(schoolClass);
        teacherRepository.save(teacher);
        return ResponseEntity.ok(teacher);
    }

    // Update student count
    @PatchMapping("/classes/{classId}/students")
    public SchoolClass updateStudentCount(
            @PathVariable Long classId, 
            @RequestBody Map<String, Integer> body) {
        
        SchoolClass schoolClass = schoolClassRepository.findById(classId).orElseThrow();
        schoolClass.setStudentCount(body.get("count"));
        return schoolClassRepository.save(schoolClass);
    }
}