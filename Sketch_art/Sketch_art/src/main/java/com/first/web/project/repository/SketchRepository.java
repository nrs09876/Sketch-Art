package com.first.web.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.first.web.project.entity.Sketch;  // ✅ Match entity package

@Repository
public interface SketchRepository extends JpaRepository<Sketch, Long> {
}
