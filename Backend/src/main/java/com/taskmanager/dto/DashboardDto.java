package com.taskmanager.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class DashboardDto {
    private long totalTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long doneTasks;
    private long overdueTasks;
    private int totalProjects;
    private Map<String, Long> tasksByStatus;
    private List<UserTaskCount> tasksByUser;
    private List<TaskDto.Response> overdue;

    @Data
    public static class UserTaskCount {
        private String userName;
        private String userEmail;
        private long taskCount;
    }
}
