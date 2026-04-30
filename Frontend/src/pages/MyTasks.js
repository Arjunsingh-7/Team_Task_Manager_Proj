import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { tasksAPI } from '../services/api';
import { Badge, Spinner, EmptyState, Button } from '../components/ui';
import toast from 'react-hot-toast';

const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [sort, setSort] = useState('dueDate');
  const navigate = useNavigate();

  useEffect(() => {
    tasksAPI.myTasks()
      .then(r => {
        const data = r.data.data || r.data;
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load tasks:', err);
        toast.error('Failed to load tasks');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (taskId, status) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task?.projectId) {
      toast.error('Missing project for this task');
      return;
    }

    try {
      await tasksAPI.updateStatus(task.projectId, taskId, status);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      toast.success('Status updated!');
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status');
    }
  };

  const filtered = tasks
    .filter(t => filter === 'ALL' || t.status === filter)
    .sort((a, b) => {
      if (sort === 'priority') return (PRIORITY_ORDER[a.priority] || 2) - (PRIORITY_ORDER[b.priority] || 2);
      if (sort === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return a.title.localeCompare(b.title);
    });

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter(t => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter(t => t.status === 'DONE').length,
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
          <Spinner size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
          My Tasks
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          All tasks assigned to you across projects
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-2)', 
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--border)',
      }}>
        {[
          ['ALL', 'All Tasks'], 
          ['TODO', 'To Do'], 
          ['IN_PROGRESS', 'In Progress'], 
          ['DONE', 'Done']
        ].map(([key, label]) => (
          <button 
            key={key} 
            onClick={() => setFilter(key)} 
            style={{
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: filter === key ? 'var(--primary-600)' : 'var(--text-secondary)',
              borderBottom: filter === key ? '2px solid var(--primary-600)' : '2px solid transparent',
              transition: 'all var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            {label}
            <span style={{
              background: filter === key ? 'var(--primary-100)' : 'var(--gray-200)',
              color: filter === key ? 'var(--primary-700)' : 'var(--text-tertiary)',
              borderRadius: 'var(--radius-full)',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--space-6)' 
      }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Showing {filtered.length} task{filtered.length !== 1 ? 's' : ''}
        </div>
        <select 
          value={sort} 
          onChange={e => setSort(e.target.value)} 
          style={{ 
            padding: '8px 12px',
            fontSize: '13px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Task List */}
      {!filtered.length ? (
        <EmptyState 
          icon="✓" 
          title={filter === 'ALL' ? 'No tasks assigned' : `No ${filter.toLowerCase().replace('_', ' ')} tasks`} 
          description="Tasks assigned to you will appear here"
          action={filter !== 'ALL' && <Button variant="secondary" onClick={() => setFilter('ALL')}>View All Tasks</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filtered.map((task, i) => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
            return (
              <div 
                key={task.id} 
                style={{
                  background: 'var(--bg)',
                  border: `1px solid ${isOverdue ? 'var(--error)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  animation: 'fadeIn 0.3s ease both',
                  animationDelay: `${i * 0.03}s`,
                  transition: 'all var(--transition)',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/projects/${task.projectId}`)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Status Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextStatus = task.status === 'DONE' ? 'IN_PROGRESS' : task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE';
                    handleStatus(task.id, nextStatus);
                  }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 'var(--radius-full)',
                    flexShrink: 0,
                    border: `2px solid ${task.status === 'DONE' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? 'var(--primary-600)' : 'var(--gray-300)'}`,
                    background: task.status === 'DONE' ? 'var(--success)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#fff',
                    transition: 'all var(--transition)',
                  }}
                >
                  {task.status === 'DONE' ? '✓' : ''}
                </button>

                {/* Task Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '14px',
                    textDecoration: task.status === 'DONE' ? 'line-through' : 'none', 
                    color: task.status === 'DONE' ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    marginBottom: 'var(--space-1)',
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ 
                      fontSize: '13px', 
                      color: 'var(--text-secondary)', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {task.description}
                    </div>
                  )}
                  {task.projectName && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'var(--text-tertiary)', 
                      marginTop: 'var(--space-1)',
                    }}>
                      📁 {task.projectName}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
                  <Badge variant={
                    task.priority === 'HIGH' ? 'error' : 
                    task.priority === 'MEDIUM' ? 'warning' : 
                    'success'
                  }>
                    {task.priority}
                  </Badge>
                  <Badge variant={
                    task.status === 'DONE' ? 'success' : 
                    task.status === 'IN_PROGRESS' ? 'info' : 
                    'default'
                  }>
                    {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status === 'DONE' ? 'Done' : 'To Do'}
                  </Badge>
                  {task.dueDate && (
                    <span style={{ 
                      fontSize: '12px', 
                      color: isOverdue ? 'var(--error)' : 'var(--text-tertiary)', 
                      minWidth: 70,
                      fontWeight: isOverdue ? 600 : 400,
                    }}>
                      {isOverdue ? '⚠ ' : '📅 '}
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
