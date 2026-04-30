package com.taskmanager.service;

import com.taskmanager.dto.ProjectDto;
import com.taskmanager.dto.UserDto;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.ProjectMember;
import com.taskmanager.entity.User;
import com.taskmanager.exception.BadRequestException;
import com.taskmanager.exception.ForbiddenException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProjectDto.Response createProject(ProjectDto.CreateRequest request, User currentUser) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(currentUser)
                .build();
        project = projectRepository.save(project);

        // Creator becomes ADMIN
        ProjectMember membership = ProjectMember.builder()
                .project(project)
                .user(currentUser)
                .role(ProjectMember.Role.ADMIN)
                .build();
        projectMemberRepository.save(membership);

        return mapToResponse(project, ProjectMember.Role.ADMIN);
    }

    public List<ProjectDto.Response> getMyProjects(User currentUser) {
        List<Project> projects = projectRepository.findAllProjectsForUser(currentUser);
        return projects.stream()
                .map(p -> {
                    ProjectMember.Role role = projectMemberRepository
                            .findByProjectAndUser(p, currentUser)
                            .map(ProjectMember::getRole)
                            .orElse(ProjectMember.Role.MEMBER);
                    return mapToResponse(p, role);
                })
                .collect(Collectors.toList());
    }

    public ProjectDto.Response getProject(Long projectId, User currentUser) {
        Project project = getProjectOrThrow(projectId);
        ProjectMember member = getMemberOrThrow(project, currentUser);
        return mapToResponse(project, member.getRole());
    }

    @Transactional
    public ProjectDto.Response updateProject(Long projectId, ProjectDto.UpdateRequest request, User currentUser) {
        Project project = getProjectOrThrow(projectId);
        ensureAdmin(project, currentUser);

        if (request.getName() != null) project.setName(request.getName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());

        project = projectRepository.save(project);
        return mapToResponse(project, ProjectMember.Role.ADMIN);
    }

    @Transactional
    public void deleteProject(Long projectId, User currentUser) {
        Project project = getProjectOrThrow(projectId);
        ensureAdmin(project, currentUser);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectDto.MemberResponse addMember(Long projectId, ProjectDto.AddMemberRequest request, User currentUser) {
        Project project = getProjectOrThrow(projectId);
        ensureAdmin(project, currentUser);

        User userToAdd = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (projectMemberRepository.existsByProjectAndUser(project, userToAdd)) {
            throw new BadRequestException("User is already a member of this project");
        }

        ProjectMember.Role role = request.getRole() != null ? request.getRole() : ProjectMember.Role.MEMBER;
        ProjectMember membership = ProjectMember.builder()
                .project(project)
                .user(userToAdd)
                .role(role)
                .build();
        membership = projectMemberRepository.save(membership);

        return mapToMemberResponse(membership);
    }

    @Transactional
    public void removeMember(Long projectId, Long userId, User currentUser) {
        Project project = getProjectOrThrow(projectId);
        ensureAdmin(project, currentUser);

        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (userToRemove.getId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot remove yourself from the project");
        }

        if (!projectMemberRepository.existsByProjectAndUser(project, userToRemove)) {
            throw new ResourceNotFoundException("User is not a member of this project");
        }

        projectMemberRepository.deleteByProjectAndUser(project, userToRemove);
    }

    public List<ProjectDto.MemberResponse> getMembers(Long projectId, User currentUser) {
        Project project = getProjectOrThrow(projectId);
        getMemberOrThrow(project, currentUser); // ensure access

        return projectMemberRepository.findByProject(project).stream()
                .map(this::mapToMemberResponse)
                .collect(Collectors.toList());
    }

    // ====== Helpers ======

    public Project getProjectOrThrow(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
    }

    private ProjectMember getMemberOrThrow(Project project, User user) {
        return projectMemberRepository.findByProjectAndUser(project, user)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this project"));
    }

    public void ensureAdmin(Project project, User user) {
        ProjectMember member = getMemberOrThrow(project, user);
        if (member.getRole() != ProjectMember.Role.ADMIN) {
            throw new ForbiddenException("Only admins can perform this action");
        }
    }

    public Optional<ProjectMember> findMembership(Project project, User user) {
        return projectMemberRepository.findByProjectAndUser(project, user);
    }

    private ProjectDto.Response mapToResponse(Project project, ProjectMember.Role role) {
        ProjectDto.Response dto = new ProjectDto.Response();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setAdminId(project.getCreatedBy().getId());
        dto.setMyRole(role.name());
        dto.setMemberCount(project.getMembers() != null ? project.getMembers().size() : 0);
        dto.setTaskCount(project.getTasks() != null ? project.getTasks().size() : 0);
        
        // Calculate done count
        int doneCount = 0;
        if (project.getTasks() != null) {
            doneCount = (int) project.getTasks().stream()
                    .filter(t -> t.getStatus() == com.taskmanager.entity.Task.Status.DONE)
                    .count();
        }
        dto.setDoneCount(doneCount);
        dto.setCreatedAt(project.getCreatedAt());

        UserDto.Summary creatorDto = new UserDto.Summary();
        creatorDto.setId(project.getCreatedBy().getId());
        creatorDto.setName(project.getCreatedBy().getName());
        creatorDto.setEmail(project.getCreatedBy().getEmail());
        dto.setCreatedBy(creatorDto);

        return dto;
    }

    private ProjectDto.MemberResponse mapToMemberResponse(ProjectMember member) {
        ProjectDto.MemberResponse dto = new ProjectDto.MemberResponse();
        dto.setId(member.getId());
        dto.setRole(member.getRole());
        dto.setJoinedAt(member.getJoinedAt());

        UserDto.Summary userDto = new UserDto.Summary();
        userDto.setId(member.getUser().getId());
        userDto.setName(member.getUser().getName());
        userDto.setEmail(member.getUser().getEmail());
        dto.setUser(userDto);

        return dto;
    }
}
