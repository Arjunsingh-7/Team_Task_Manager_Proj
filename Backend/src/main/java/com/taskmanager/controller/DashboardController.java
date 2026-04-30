package com.taskmanager.controller;

import com.taskmanager.config.CurrentUserProvider;
import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.DashboardDto;
import com.taskmanager.entity.User;
import com.taskmanager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDto>> getDashboard() {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboard(user)));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<DashboardDto>> getProjectDashboard(@PathVariable Long projectId) {
        User user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getProjectDashboard(projectId, user)));
    }
}
