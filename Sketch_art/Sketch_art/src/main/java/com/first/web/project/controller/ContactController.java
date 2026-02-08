package com.first.web.project.controller;

import com.first.web.project.entity.Contact;
import com.first.web.project.repository.ContactRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // frontend ko allow karega
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // ✅ Save contact (form se data aayega)
    @PostMapping("/save")
    public Contact saveContact(@RequestBody Contact contact) {
        return contactRepository.save(contact);
    }
    @DeleteMapping("/delete/{id}")
public ResponseEntity<String> deleteContact(@PathVariable Long id) {
    if (!contactRepository.existsById(id)) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contact not found");
    }
    contactRepository.deleteById(id);
    return ResponseEntity.ok("Deleted successfully");
}

    // ✅ Get all contacts (frontend/admin pe dikhane ke liye)
    @GetMapping("/all")
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
}
