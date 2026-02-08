package com.first.web.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.first.web.project.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
