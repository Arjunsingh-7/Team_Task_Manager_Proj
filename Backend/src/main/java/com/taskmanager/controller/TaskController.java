package com.taskmanager.controller;

import com.taskmanager.config.CurrentUserProvider;
import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.TaskDto;
import com.taskmanager.entity.User;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto.Response>> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskDto.CreateRequest request) {
        User user = currentUserProvider.getCurrentUser();
        System.out.println("📝 Creating task in project " + projectId + ": " + request);
        TaskDto.Response response = taskService.createTask(projectId, request, user);
        System.out.println("✅ Task created successfully: " + response);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDto.Response>>> getTasksByProject(
            @PathVariable Long projectId) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasksByProject(projectId, user)));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskDto.Response>> getTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(taskService.getTask(projectId, taskId, user)));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskDto.Response>> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestBody TaskDto.UpdateRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Task updated", taskService.updateTask(projectId, taskId, request, user)));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<ApiResponse<TaskDto.Response>> updateTaskStatus(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskDto.StatusUpdateRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                taskService.updateTaskStatus(projectId, taskId, request, user)));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId) {
        User user = currentUserProvider.getCurrentUser();
        taskService.deleteTask(projectId, taskId, user);
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }
}
