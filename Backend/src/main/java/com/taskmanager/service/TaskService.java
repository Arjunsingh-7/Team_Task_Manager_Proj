package com.taskmanager.service;

import com.taskmanager.dto.ProjectDto;
import com.taskmanager.dto.TaskDto;
import com.taskmanager.dto.UserDto;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.ProjectMember;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ForbiddenException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    @Transactional
    public TaskDto.Response createTask(Long projectId, TaskDto.CreateRequest request, User currentUser) {
        Project project = projectService.getProjectOrThrow(projectId);
        // Any member can create tasks (not just admin)
        ensureMember(project, currentUser);

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            // Verify assignee is a member of the project
            projectService.findMembership(project, assignee)
                    .orElseThrow(() -> new ForbiddenException("Assignee must be a member of the project"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(Task.Status.TODO)
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .project(project)
                .assignee(assignee)
                .createdBy(currentUser)
                .build();

        task = taskRepository.save(task);
        System.out.println("✅ Task created successfully: " + task.getId() + " - " + task.getTitle());
        return mapToResponse(task);
    }

    public List<TaskDto.Response> getTasksByProject(Long projectId, User currentUser) {
        Project project = projectService.getProjectOrThrow(projectId);
        ensureMember(project, currentUser);

        ProjectMember.Role role = projectService.findMembership(project, currentUser)
                .map(ProjectMember::getRole).orElse(ProjectMember.Role.MEMBER);

        List<Task> tasks;
        if (role == ProjectMember.Role.ADMIN) {
            tasks = taskRepository.findByProject(project);
        } else {
            tasks = taskRepository.findByProjectAndAssignee(project, currentUser);
        }

        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TaskDto.Response getTask(Long projectId, Long taskId, User currentUser) {
        Project project = projectService.getProjectOrThrow(projectId);
        ensureMember(project, currentUser);
        Task task = getTaskOrThrow(taskId, project);
        ensureCanViewTask(task, currentUser, project);
        return mapToResponse(task);
    }

    @Transactional
    public TaskDto.Response updateTask(Long projectId, Long taskId, TaskDto.UpdateRequest request, User currentUser) {
        Project project = projectService.getProjectOrThrow(projectId);
        ensureMember(project, currentUser);
        Task task = getTaskOrThrow(taskId, project);

        ProjectMember.Role role = projectService.findMembership(project, currentUser)
                .map(ProjectMember::getRole).orElse(ProjectMember.Role.MEMBER);

        if (role == ProjectMember.Role.ADMIN) {
            // Admin can update everything
            if (request.getTitle() != null) task.setTitle(request.getTitle());
            if (request.getDescription() != null) task.setDescription(request.getDescription());
            if (request.getPriority() != null) task.setPriority(request.getPriority());
            if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
            if (request.getAssigneeId() != null) {
                User assignee = userRepository.findById(request.getAssigneeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
                task.setAssignee(assignee);
            }
        }

        // Both admin and assigned member can update status
        if (request.getStatus() != null) {
            if (role == ProjectMember.Role.MEMBER) {
                // Member can only update tasks assigned to them
                if (task.getAssignee() == null || !task.getAssignee().getId().equals(currentUser.getId())) {
                    throw new ForbiddenException("You can only update tasks assigned to you");
                }
            }
            task.setStatus(request.getStatus());
        }

        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Transactional
    public TaskDto.Response updateTaskStatus(Long projectId, Long taskId,
                                              TaskDto.StatusUpdateRequest request, User currentUser) {
        Project project = projectService.getProjectOrThrow(projectId);
        ensureMember(project, currentUser);
        Task task = getTaskOrThrow(taskId, project);

        ProjectMember.Role role = projectService.findMembership(project, currentUser)
                .map(ProjectMember::getRole).orElse(ProjectMember.Role.MEMBER);

        if (role == ProjectMember.Role.MEMBER) {
            if (task.getAssignee() == null || !task.getAssignee().getId().equals(currentUser.getId())) {
                throw new ForbiddenException("You can only update status of tasks assigned to you");
            }
        }

        task.setStatus(request.getStatus());
        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Transactional
    public void deleteTask(Long projectId, Long taskId, User currentUser) {
        Project project = projectService.getProjectOrThrow(projectId);
        projectService.ensureAdmin(project, currentUser);
        Task task = getTaskOrThrow(taskId, project);
        taskRepository.delete(task);
    }

    public List<TaskDto.Response> getMyTasks(User currentUser) {
        return taskRepository.findByAssignee(currentUser)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ====== Helpers ======

    private Task getTaskOrThrow(Long taskId, Project project) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        if (!task.getProject().getId().equals(project.getId())) {
            throw new ResourceNotFoundException("Task does not belong to this project");
        }
        return task;
    }

    private void ensureMember(Project project, User user) {
        projectService.findMembership(project, user)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this project"));
    }

    private void ensureCanViewTask(Task task, User user, Project project) {
        ProjectMember.Role role = projectService.findMembership(project, user)
                .map(ProjectMember::getRole).orElse(ProjectMember.Role.MEMBER);

        if (role == ProjectMember.Role.MEMBER) {
            if (task.getAssignee() == null || !task.getAssignee().getId().equals(user.getId())) {
                throw new ForbiddenException("You can only view tasks assigned to you");
            }
        }
    }

    public TaskDto.Response mapToResponse(Task task) {
        TaskDto.Response dto = new TaskDto.Response();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        dto.setOverdue(task.getDueDate() != null
                && task.getDueDate().isBefore(LocalDate.now())
                && task.getStatus() != Task.Status.DONE);

        // Project info
        dto.setProjectId(task.getProject().getId());
        dto.setProjectName(task.getProject().getName());

        if (task.getAssignee() != null) {
            dto.setAssigneeId(task.getAssignee().getId());
            UserDto.Summary a = new UserDto.Summary();
            a.setId(task.getAssignee().getId());
            a.setName(task.getAssignee().getName());
            a.setEmail(task.getAssignee().getEmail());
            dto.setAssignee(a);
        }

        UserDto.Summary creator = new UserDto.Summary();
        creator.setId(task.getCreatedBy().getId());
        creator.setName(task.getCreatedBy().getName());
        creator.setEmail(task.getCreatedBy().getEmail());
        dto.setCreatedBy(creator);

        ProjectDto.Response projectDto = new ProjectDto.Response();
        projectDto.setId(task.getProject().getId());
        projectDto.setName(task.getProject().getName());
        dto.setProject(projectDto);

        return dto;
    }
}
