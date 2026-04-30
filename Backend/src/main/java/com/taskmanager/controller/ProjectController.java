package com.taskmanager.controller;

import com.taskmanager.config.CurrentUserProvider;
import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.ProjectDto;
import com.taskmanager.entity.User;
import com.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final CurrentUserProvider currentUserProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto.Response>> createProject(
            @Valid @RequestBody ProjectDto.CreateRequest request) {
        User user = currentUserProvider.getCurrentUser();
        ProjectDto.Response response = projectService.createProject(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto.Response>>> getMyProjects() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(projectService.getMyProjects(user)));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectDto.Response>> getProject(@PathVariable Long projectId) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(projectService.getProject(projectId, user)));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectDto.Response>> updateProject(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectDto.UpdateRequest request) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Project updated", projectService.updateProject(projectId, request, user)));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long projectId) {
        User user = currentUserProvider.getCurrentUser();
        projectService.deleteProject(projectId, user);
        return ResponseEntity.ok(ApiResponse.success("Project deleted", null));
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<ApiResponse<List<ProjectDto.MemberResponse>>> getMembers(@PathVariable Long projectId) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(projectService.getMembers(projectId, user)));
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ApiResponse<ProjectDto.MemberResponse>> addMember(
            @PathVariable Long projectId,
            @RequestBody ProjectDto.AddMemberRequest request) {
        User user = currentUserProvider.getCurrentUser();
        System.out.println("➕ Adding member to project " + projectId + ": userId=" + request.getUserId() + ", role=" + request.getRole());
        ProjectDto.MemberResponse response = projectService.addMember(projectId, request, user);
        System.out.println("✅ Member added successfully: " + response);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Member added successfully", response));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        User user = currentUserProvider.getCurrentUser();
        projectService.removeMember(projectId, userId, user);
        return ResponseEntity.ok(ApiResponse.success("Member removed", null));
    }
}
