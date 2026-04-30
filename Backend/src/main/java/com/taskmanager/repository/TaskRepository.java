package com.taskmanager.repository;

import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignee(User user);

    List<Task> findByProjectAndAssignee(Project project, User user);

    @Query("SELECT t FROM Task t WHERE t.project = :project AND t.dueDate < :today AND t.status != 'DONE'")
    List<Task> findOverdueTasksByProject(@Param("project") Project project,
                                         @Param("today") LocalDate today);

    @Query("SELECT t FROM Task t JOIN t.project p JOIN p.members m WHERE m.user = :user AND t.dueDate < :today AND t.status != 'DONE'")
    List<Task> findOverdueTasksForUser(@Param("user") User user,
                                       @Param("today") LocalDate today);

    @Query("SELECT t FROM Task t JOIN t.project p JOIN p.members m WHERE m.user = :user")
    List<Task> findAllTasksForUser(@Param("user") User user);

    long countByProject(Project project);

    long countByProjectAndStatus(Project project, Task.Status status);

    @Query("SELECT t.assignee, COUNT(t) FROM Task t WHERE t.project = :project GROUP BY t.assignee")
    List<Object[]> countTasksByAssigneeInProject(@Param("project") Project project);
}
