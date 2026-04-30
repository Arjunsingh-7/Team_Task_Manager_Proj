package com.taskmanager.dto;

import com.taskmanager.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        @Size(min = 2, max = 200, message = "Title must be 2-200 characters")
        private String title;

        @Size(max = 1000, message = "Description max 1000 characters")
        private String description;

        @NotNull(message = "Priority is required")
        private Task.Priority priority;

        private LocalDate dueDate;

        private Long assigneeId;
    }

    @Data
    public static class UpdateRequest {
        @Size(min = 2, max = 200)
        private String title;

        @Size(max = 1000)
        private String description;

        private Task.Status status;
        private Task.Priority priority;
        private LocalDate dueDate;
        private Long assigneeId;
    }

    @Data
    public static class StatusUpdateRequest {
        @NotNull(message = "Status is required")
        private Task.Status status;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private Task.Status status;
        private Task.Priority priority;
        private LocalDate dueDate;
        private boolean overdue;
        private Long projectId;
        private String projectName;
        private ProjectDto.Response project;
        private Long assigneeId;
        private UserDto.Summary assignee;
        private UserDto.Summary createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
