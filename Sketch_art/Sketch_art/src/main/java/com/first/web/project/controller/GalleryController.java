package com.first.web.project.controller;

import com.first.web.project.entity.Sketch;
import com.first.web.project.repository.SketchRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*") // CORS enable
@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final SketchRepository sketchRepository;

    public GalleryController(SketchRepository sketchRepository) {
        this.sketchRepository = sketchRepository;
    }

    // GET all sketches
    @GetMapping("/all")
    public List<Sketch> getAllSketches() {
        return sketchRepository.findAll();
    }

    // POST new sketch
    @PostMapping("/add")
    public Sketch addSketch(@RequestBody Sketch sketch) {
        return sketchRepository.save(sketch);
    }

    // DELETE sketch by id
    @DeleteMapping("/delete/{id}")
    public String deleteSketch(@PathVariable Long id) {
        sketchRepository.deleteById(id);
        return "Deleted successfully";
    }
}
