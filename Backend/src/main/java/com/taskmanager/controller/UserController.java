package com.taskmanager.controller;

import com.taskmanager.config.CurrentUserProvider;
import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.TaskDto;
import com.taskmanager.dto.UserDto;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;
    private final TaskService taskService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto.Summary>> getMe() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(mapToSummary(user)));
    }

    @GetMapping("/me/tasks")
    public ResponseEntity<ApiResponse<List<TaskDto.Response>>> getMyTasks() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(taskService.getMyTasks(user)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto.Summary>>> getAllUsers() {
        List<UserDto.Summary> users = userRepository.findAll()
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDto.Summary>> getUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.taskmanager.exception.ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(mapToSummary(user)));
    }

    private UserDto.Summary mapToSummary(User user) {
        UserDto.Summary dto = new UserDto.Summary();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
