package jar.eduhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jar.eduhub.entity.Assignment;
import jar.eduhub.repository.AssignmentRepository;

@RestController
@RequestMapping("/api/teacher/assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @PostMapping
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}