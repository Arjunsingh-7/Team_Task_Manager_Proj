package com.taskmanager.dto;

import com.taskmanager.entity.ProjectMember;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Project name is required")
        @Size(min = 2, max = 150, message = "Name must be 2-150 characters")
        private String name;

        @Size(max = 500, message = "Description max 500 characters")
        private String description;
    }

    @Data
    public static class UpdateRequest {
        @Size(min = 2, max = 150)
        private String name;

        @Size(max = 500)
        private String description;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private Long adminId;
        private UserDto.Summary createdBy;
        private String myRole;
        private int memberCount;
        private int taskCount;
        private int doneCount;
        private LocalDateTime createdAt;
    }

    @Data
    public static class AddMemberRequest {
        private Long userId;
        private ProjectMember.Role role;
    }

    @Data
    public static class MemberResponse {
        private Long id;
        private UserDto.Summary user;
        private ProjectMember.Role role;
        private LocalDateTime joinedAt;
    }
}
