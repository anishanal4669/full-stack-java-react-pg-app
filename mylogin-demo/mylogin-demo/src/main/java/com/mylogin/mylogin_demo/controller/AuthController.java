package com.mylogin.mylogin_demo.controller;


import com.mylogin.mylogin_demo.model.User;
import com.mylogin.mylogin_demo.repository.UserRepository;
import com.mylogin.mylogin_demo.util.JwtUtil;
import com.mylogin.mylogin_demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private UserRepository userRepository; // A service for managing the user repository

    @Autowired
    private PasswordEncoder passwordEncoder; // A service for encoding the passwords to be stored

    @Autowired
    private JwtUtil jwtUtil; // A service for generating jwt tokens

    @Autowired
    private EmailService emailService; // A service for sending emails

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        try {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new RuntimeException("Email is already registered!");
            }
            // Encode the password
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            // Save the user
            userRepository.save(user);
            return "User registered successfully!";
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
        try {
            // Check if the user exists by email
            Optional<User> userOptional = userRepository.findByEmail(loginData.get("email"));
            System.out.println(userOptional);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Create a response with a success message and the token
                Map<String, String> response = new HashMap<>();

                if (passwordEncoder.matches(loginData.get("password"), user.getPassword())) {
//                    String token = jwtUtil.generateToken(user.getUsername());
//                    response.put("token", token);
                    response.put("message", "Login successful!");
                    return ResponseEntity.ok(response); // Return HTTP 200 with the response
                } else {
                    response.put("message", "Login unsuccessful");
                    return ResponseEntity.badRequest().body(response); // Return HTTP 400 with the response
                }
            }
            // If the user is not found or credentials are invalid
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials!"));
        } catch (Exception e) {
            e.printStackTrace(); // Print the stack trace for debugging
            // Handle unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during login. Please try again."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> requestData) {
        String email = requestData.get("email");
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String temporaryPassword = UUID.randomUUID().toString().substring(0, 8); // Generate a random password
            user.setPassword(passwordEncoder.encode(temporaryPassword));
            userRepository.save(user);

            String subject = "Password Reset Request";
            String body = String.format(
                    "Hi %s,\n\nYour password has been reset. Use the following temporary password to log in: %s\n\nPlease change your password after logging in.",
                    user.getUsername(), temporaryPassword);

            emailService.sendEmail(email, subject, body);
            return ResponseEntity.ok("Password reset email sent.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not registered.");
        }
    }
}



