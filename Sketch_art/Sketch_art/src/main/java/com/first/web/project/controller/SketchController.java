package com.first.web.project.controller;

import com.first.web.project.entity.Sketch;
import com.first.web.project.repository.SketchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sketches")
@CrossOrigin(origins = "*")   
public class SketchController {

    @Autowired
    private SketchRepository sketchRepository;

    // Create
    @PostMapping
    public ResponseEntity<Sketch> createSketch(@RequestBody Sketch sketch) {
        if (sketch.getTitle() == null || sketch.getDescription() == null || sketch.getImageUrl() == null) {
            return ResponseEntity.badRequest().build(); 
        }
        Sketch savedSketch = sketchRepository.save(sketch);
        return ResponseEntity.ok(savedSketch);
    }

    // Read All
    @GetMapping
    public List<Sketch> getAllSketches() {
        return sketchRepository.findAll();
    }

    // Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<Sketch> getSketchById(@PathVariable Long id) {
        return sketchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Sketch> updateSketch(@PathVariable Long id, @RequestBody Sketch sketchDetails) {
        return sketchRepository.findById(id)
                .map(sketch -> {
                    sketch.setTitle(sketchDetails.getTitle());
                    sketch.setDescription(sketchDetails.getDescription());
                    sketch.setImageUrl(sketchDetails.getImageUrl());
                    return ResponseEntity.ok(sketchRepository.save(sketch));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSketch(@PathVariable Long id) {
        return sketchRepository.findById(id)
                .map(sketch -> {
                    sketchRepository.delete(sketch);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
