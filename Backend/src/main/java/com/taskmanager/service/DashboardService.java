package com.taskmanager.service;

import com.taskmanager.dto.DashboardDto;
import com.taskmanager.dto.TaskDto;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.ProjectMember;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final TaskService taskService;

    public DashboardDto getDashboard(User currentUser) {
        List<Project> projects = projectRepository.findAllProjectsForUser(currentUser);
        DashboardDto dto = new DashboardDto();

        dto.setTotalProjects(projects.size());

        long total = 0, todo = 0, inProgress = 0, done = 0, overdue = 0;
        List<TaskDto.Response> overdueTasksList = new ArrayList<>();
        Map<String, Long> tasksByUser = new HashMap<>();

        for (Project project : projects) {
            // Count tasks per project
            total += taskRepository.countByProject(project);
            todo += taskRepository.countByProjectAndStatus(project, Task.Status.TODO);
            inProgress += taskRepository.countByProjectAndStatus(project, Task.Status.IN_PROGRESS);
            done += taskRepository.countByProjectAndStatus(project, Task.Status.DONE);

            // Overdue tasks
            List<Task> overdueInProject = taskRepository.findOverdueTasksByProject(project, LocalDate.now());
            overdue += overdueInProject.size();
            overdueTasksList.addAll(overdueInProject.stream()
                    .map(taskService::mapToResponse)
                    .collect(Collectors.toList()));

            // Tasks per user
            List<Object[]> perUser = taskRepository.countTasksByAssigneeInProject(project);
            for (Object[] row : perUser) {
                User assignee = (User) row[0];
                Long count = (Long) row[1];
                if (assignee != null) {
                    tasksByUser.merge(assignee.getName() + " (" + assignee.getEmail() + ")", count, Long::sum);
                }
            }
        }

        dto.setTotalTasks(total);
        dto.setTodoTasks(todo);
        dto.setInProgressTasks(inProgress);
        dto.setDoneTasks(done);
        dto.setOverdueTasks(overdue);

        Map<String, Long> statusMap = new LinkedHashMap<>();
        statusMap.put("TODO", todo);
        statusMap.put("IN_PROGRESS", inProgress);
        statusMap.put("DONE", done);
        dto.setTasksByStatus(statusMap);

        List<DashboardDto.UserTaskCount> userTaskCounts = tasksByUser.entrySet().stream()
                .map(e -> {
                    DashboardDto.UserTaskCount utc = new DashboardDto.UserTaskCount();
                    String key = e.getKey();
                    int parenIdx = key.lastIndexOf(" (");
                    utc.setUserName(parenIdx > 0 ? key.substring(0, parenIdx) : key);
                    utc.setUserEmail(parenIdx > 0 ? key.substring(parenIdx + 2, key.length() - 1) : "");
                    utc.setTaskCount(e.getValue());
                    return utc;
                })
                .sorted(Comparator.comparingLong(DashboardDto.UserTaskCount::getTaskCount).reversed())
                .collect(Collectors.toList());

        dto.setTasksByUser(userTaskCounts);

        // Return first 5 overdue tasks
        overdueTasksList.sort(Comparator.comparing(t -> t.getDueDate()));
        dto.setOverdue(overdueTasksList.stream().limit(5).collect(Collectors.toList()));

        return dto;
    }

    public DashboardDto getProjectDashboard(Long projectId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        DashboardDto dto = new DashboardDto();
        dto.setTotalProjects(1);

        long total = taskRepository.countByProject(project);
        long todo = taskRepository.countByProjectAndStatus(project, Task.Status.TODO);
        long inProgress = taskRepository.countByProjectAndStatus(project, Task.Status.IN_PROGRESS);
        long done = taskRepository.countByProjectAndStatus(project, Task.Status.DONE);

        List<Task> overdueList = taskRepository.findOverdueTasksByProject(project, LocalDate.now());

        dto.setTotalTasks(total);
        dto.setTodoTasks(todo);
        dto.setInProgressTasks(inProgress);
        dto.setDoneTasks(done);
        dto.setOverdueTasks(overdueList.size());

        Map<String, Long> statusMap = new LinkedHashMap<>();
        statusMap.put("TODO", todo);
        statusMap.put("IN_PROGRESS", inProgress);
        statusMap.put("DONE", done);
        dto.setTasksByStatus(statusMap);

        List<Object[]> perUser = taskRepository.countTasksByAssigneeInProject(project);
        List<DashboardDto.UserTaskCount> userTaskCounts = perUser.stream()
                .filter(row -> row[0] != null)
                .map(row -> {
                    User assignee = (User) row[0];
                    DashboardDto.UserTaskCount utc = new DashboardDto.UserTaskCount();
                    utc.setUserName(assignee.getName());
                    utc.setUserEmail(assignee.getEmail());
                    utc.setTaskCount((Long) row[1]);
                    return utc;
                })
                .collect(Collectors.toList());
        dto.setTasksByUser(userTaskCounts);

        dto.setOverdue(overdueList.stream()
                .map(taskService::mapToResponse)
                .limit(5)
                .collect(Collectors.toList()));

        return dto;
    }
}
