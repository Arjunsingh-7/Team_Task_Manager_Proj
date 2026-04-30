import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { projectsAPI, tasksAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Modal, Input, Textarea, Select, Badge, Avatar, Spinner, EmptyState } from '../components/ui';
import toast from 'react-hot-toast';

const COLUMNS = [
  { key: 'TODO', label: 'To Do', color: 'var(--gray-500)' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'var(--primary-600)' },
  { key: 'DONE', label: 'Done', color: 'var(--success)' },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTask, setShowTask] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [view, setView] = useState('board'); // 'board' | 'list'

  const isAdmin = project?.adminId === user?.id;

  const load = useCallback(() => {
    Promise.all([
      projectsAPI.get(id),
      tasksAPI.list(id),
      projectsAPI.getMembers(id),
    ]).then(([p, t, m]) => {
      // Handle wrapped API responses
      const projectData = p.data.data || p.data;
      const tasksData = t.data.data || t.data;
      const membersData = m.data.data || m.data;
      
      console.log('📊 Loaded data:', { projectData, tasksData, membersData });
      
      setProject(projectData);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      
      // Transform members data: extract user from nested structure
      const transformedMembers = Array.isArray(membersData) 
        ? membersData.map(member => ({
            id: member.user?.id || member.id,
            name: member.user?.name || member.name,
            email: member.user?.email || member.email,
            role: member.role,
            joinedAt: member.joinedAt
          }))
        : [];
      
      console.log('👥 Transformed members:', transformedMembers);
      setMembers(transformedMembers);
    }).catch((err) => { 
      console.error('❌ Failed to load project:', err);
      toast.error('Project not found'); 
      navigate('/projects'); 
    })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    load();
    // Fetch all users for the members dropdown
    usersAPI.list().then(r => {
      const usersData = r.data.data || r.data;
      console.log('👤 Fetched users:', usersData);
      setUsers(Array.isArray(usersData) ? usersData : []);
    }).catch((err) => {
      console.error('❌ Failed to load users:', err);
    });
  }, [load]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await tasksAPI.updateStatus(id, taskId, status);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(id, taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const tasksByStatus = (status) => Array.isArray(tasks) ? tasks.filter(t => t.status === status) : [];

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
      {/* Back Button */}
      <button 
        onClick={() => navigate('/projects')} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-tertiary)', 
          cursor: 'pointer', 
          fontSize: '13px', 
          marginBottom: 'var(--space-4)', 
          padding: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)',
          transition: 'color var(--transition)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
      >
        ← Back to Projects
      </button>

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
              {project?.name}
            </h1>
            {project?.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {project.description}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexShrink: 0 }}>
            <Button variant="secondary" onClick={() => setShowMembers(true)}>
              👥 Members ({members.length})
            </Button>
            {isAdmin && (
              <Button onClick={() => { setEditTask(null); setShowTask(true); }}>
                + Add Task
              </Button>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-1)', 
          borderBottom: '1px solid var(--border)',
        }}>
          {[['board', '⊞ Board'], ['list', '☰ List']].map(([v, l]) => (
            <button 
              key={v} 
              onClick={() => setView(v)} 
              style={{
                padding: 'var(--space-3) var(--space-4)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                color: view === v ? 'var(--primary-600)' : 'var(--text-secondary)',
                borderBottom: view === v ? '2px solid var(--primary-600)' : '2px solid transparent',
                transition: 'all var(--transition)',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Board / List View */}
      {view === 'board' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', alignItems: 'start' }}>
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.key}
              col={col}
              tasks={tasksByStatus(col.key)}
              isAdmin={isAdmin}
              members={members}
              onStatusChange={handleStatusChange}
              onEdit={(t) => { setEditTask(t); setShowTask(true); }}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          isAdmin={isAdmin}
          members={members}
          onStatusChange={handleStatusChange}
          onEdit={(t) => { setEditTask(t); setShowTask(true); }}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Modals */}
      <TaskModal
        isOpen={showTask}
        onClose={() => { setShowTask(false); setEditTask(null); }}
        task={editTask}
        projectId={id}
        members={members}
        isAdmin={isAdmin}
        onSaved={(t) => {
          const taskData = t.data || t;
          if (editTask) setTasks(prev => prev.map(x => x.id === taskData.id ? taskData : x));
          else setTasks(prev => [...prev, taskData]);
          setShowTask(false); 
          setEditTask(null);
        }}
      />
      <MembersModal
        isOpen={showMembers}
        onClose={() => setShowMembers(false)}
        members={members}
        allUsers={users}
        projectId={id}
        isAdmin={isAdmin}
        onUpdate={setMembers}
      />
    </Layout>
  );
}

function KanbanColumn({ col, tasks, isAdmin, members, onStatusChange, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: col.color }} />
        <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: col.color }}>
          {col.label}
        </span>
        <span style={{ 
          background: 'var(--gray-200)', 
          color: 'var(--text-tertiary)', 
          borderRadius: 'var(--radius-full)', 
          padding: '2px 8px', 
          fontSize: '11px', 
          fontWeight: 600 
        }}>
          {tasks.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', minHeight: 120 }}>
        {tasks.length === 0 ? (
          <div style={{ 
            padding: 'var(--space-6)', 
            textAlign: 'center', 
            border: '2px dashed var(--border)', 
            borderRadius: 'var(--radius-lg)', 
            color: 'var(--text-tertiary)', 
            fontSize: '13px' 
          }}>
            No tasks
          </div>
        ) : tasks.map((t, i) => (
          <TaskCard
            key={t.id} 
            task={t} 
            isAdmin={isAdmin} 
            members={members}
            onStatusChange={onStatusChange} 
            onEdit={onEdit} 
            onDelete={onDelete}
            style={{ animationDelay: `${i * 0.04}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, isAdmin, members, onStatusChange, onEdit, onDelete, style }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const assignee = members.find(m => m.id === task.assigneeId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div style={{
      background: 'var(--bg)',
      border: `1px solid ${isOverdue ? 'var(--error)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      position: 'relative',
      animation: 'fadeIn 0.3s ease both',
      ...style,
      transition: 'all var(--transition)',
      cursor: 'pointer',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        <span style={{ fontWeight: 600, fontSize: '14px', flex: 1, color: 'var(--text-primary)' }}>
          {task.title}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(m => !m); }}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-tertiary)', 
            cursor: 'pointer', 
            fontSize: '16px', 
            padding: '0 4px', 
            lineHeight: 1 
          }}
        >
          ⋮
        </button>
      </div>

      {task.description && (
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '12px', 
          marginBottom: 'var(--space-3)', 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          lineHeight: 1.4,
        }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        <Badge variant={
          task.priority === 'HIGH' ? 'error' : 
          task.priority === 'MEDIUM' ? 'warning' : 
          'success'
        }>
          {task.priority}
        </Badge>
        {assignee && <Avatar name={assignee.name} size={24} title={assignee.name} />}
      </div>

      {task.dueDate && (
        <div style={{ 
          fontSize: '11px', 
          color: isOverdue ? 'var(--error)' : 'var(--text-tertiary)', 
          fontWeight: isOverdue ? 600 : 400,
        }}>
          {isOverdue ? '⚠ ' : '📅 '}
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}

      {/* Quick Status Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: 'var(--space-3)' }}>
        {COLUMNS.filter(c => c.key !== task.status).map(c => (
          <button 
            key={c.key} 
            onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, c.key); }}
            style={{
              fontSize: '10px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gray-100)',
              border: '1px solid var(--border)',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { 
              e.currentTarget.style.color = c.color; 
              e.currentTarget.style.borderColor = c.color; 
              e.currentTarget.style.background = 'var(--bg)';
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.color = 'var(--text-tertiary)'; 
              e.currentTarget.style.borderColor = 'var(--border)'; 
              e.currentTarget.style.background = 'var(--gray-100)';
            }}
          >
            → {c.label}
          </button>
        ))}
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: 36,
          right: 10,
          zIndex: 100,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          minWidth: 120,
          boxShadow: 'var(--shadow-lg)',
        }} onMouseLeave={() => setMenuOpen(false)}>
          <button onClick={(e) => { e.stopPropagation(); onEdit(task); setMenuOpen(false); }} style={menuBtnStyle}>
            Edit
          </button>
          {isAdmin && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); setMenuOpen(false); }} style={{ ...menuBtnStyle, color: 'var(--error)' }}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const menuBtnStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 14px',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'background var(--transition)',
};

function TaskList({ tasks, isAdmin, members, onStatusChange, onEdit, onDelete }) {
  if (!tasks.length) return <EmptyState icon="◻" title="No tasks yet" description="Add tasks to get started" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {tasks.map(task => {
        const assignee = members.find(m => m.id === task.assigneeId);
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
        return (
          <div key={task.id} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
            background: 'var(--bg)', border: `1px solid ${isOverdue ? 'var(--error)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', padding: '12px 16px',
            animation: 'fadeIn 0.3s ease both',
            transition: 'all var(--transition)',
          }}>
            <Select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)} style={{ width: 130, padding: '4px 8px', fontSize: 12 }}>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </Select>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
              {task.description && <div style={{ color: 'var(--text-secondary)', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.description}</div>}
            </div>
            <Badge variant={
              task.priority === 'HIGH' ? 'error' : 
              task.priority === 'MEDIUM' ? 'warning' : 
              'success'
            }>{task.priority}</Badge>
            {assignee && <Avatar name={assignee.name} size={26} title={assignee.name} />}
            {task.dueDate && <span style={{ fontSize: 12, color: isOverdue ? 'var(--error)' : 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
            <button onClick={() => onEdit(task)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 14, transition: 'color var(--transition)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>✎</button>
            {isAdmin && <button onClick={() => onDelete(task.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 14, transition: 'opacity var(--transition)' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>✕</button>}
          </div>
        );
      })}
    </div>
  );
}

function TaskModal({ isOpen, onClose, task, projectId, members, isAdmin, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM', assigneeId: '', status: 'TODO' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📝 TaskModal opened - task:', task);
    console.log('📝 TaskModal - members:', members);
    
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || 'MEDIUM',
        assigneeId: task.assigneeId || '',
        status: task.status || 'TODO',
      });
    } else {
      setForm({ title: '', description: '', dueDate: '', priority: 'MEDIUM', assigneeId: '', status: 'TODO' });
    }
    setErrors({});
  }, [task, isOpen, members]);

  const set = k => e => {
    console.log(`📝 Form field changed: ${k} =`, e.target.value);
    setForm(f => ({ ...f, [k]: e.target.value }));
  };

  const handleSubmit = async () => {
    console.log('📤 Submitting task form:', form);
    
    if (!form.title.trim()) { 
      setErrors({ title: 'Title required' }); 
      toast.error('Title is required');
      return; 
    }
    
    if (!form.priority) {
      toast.error('Priority is required');
      return;
    }
    
    setLoading(true);
    
    try {
      let res;
      
      // For CREATE: Don't send status (backend defaults to TODO)
      // For UPDATE: Send all fields including status
      const payload = task ? {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || null,
        assigneeId: form.assigneeId ? parseInt(form.assigneeId) : null
      } : {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || null,
        assigneeId: form.assigneeId ? parseInt(form.assigneeId) : null
      };
      
      console.log('📤 Sending payload:', payload);
      
      if (task) {
        res = await tasksAPI.update(projectId, task.id, payload);
        console.log('✅ Task updated:', res.data);
      } else {
        res = await tasksAPI.create(projectId, payload);
        console.log('✅ Task created:', res.data);
      }
      
      toast.success(task ? 'Task updated!' : 'Task created!');
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error('❌ Failed to save task:', err);
      console.error('❌ Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to save task';
      toast.error(errorMsg);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'} width={520}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input 
          label="Title *" 
          placeholder="Task title..." 
          value={form.title} 
          onChange={set('title')} 
          error={errors.title} 
          autoFocus 
        />
        
        <Textarea 
          label="Description" 
          placeholder="What needs to be done?" 
          value={form.description} 
          onChange={set('description')} 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: task ? '1fr 1fr' : '1fr', gap: 'var(--space-3)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
              Priority *
            </label>
            <Select value={form.priority} onChange={set('priority')}>
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </Select>
          </div>
          
          {task && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                Status
              </label>
              <Select value={form.status} onChange={set('status')}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </Select>
            </div>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Input 
            label="Due Date" 
            type="date" 
            value={form.dueDate} 
            onChange={set('dueDate')} 
          />
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
              Assign To
            </label>
            <Select value={form.assigneeId} onChange={set('assigneeId')}>
              <option value="">Unassigned</option>
              {members && members.length > 0 ? (
                members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No members available</option>
              )}
            </Select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleSubmit}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function MembersModal({ isOpen, onClose, members, allUsers, projectId, isAdmin, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  console.log('🔍 MembersModal - members:', members);
  console.log('🔍 MembersModal - allUsers:', allUsers);

  const nonMembers = allUsers.filter(u => !members.find(m => m.id === u.id));
  
  console.log('🔍 MembersModal - nonMembers:', nonMembers);

  const addMember = async () => {
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }
    
    console.log('➕ Adding member:', selectedUser);
    setAdding(true);
    
    try {
      const response = await projectsAPI.addMember(projectId, selectedUser);
      console.log('✅ Member added response:', response.data);
      
      // Reload members to get fresh data with correct structure
      const membersResponse = await projectsAPI.getMembers(projectId);
      const membersData = membersResponse.data.data || membersResponse.data;
      
      // Transform members data
      const transformedMembers = Array.isArray(membersData) 
        ? membersData.map(member => ({
            id: member.user?.id || member.id,
            name: member.user?.name || member.name,
            email: member.user?.email || member.email,
            role: member.role,
            joinedAt: member.joinedAt
          }))
        : [];
      
      onUpdate(transformedMembers);
      setSelectedUser('');
      toast.success('Member added!');
    } catch (err) {
      console.error('❌ Failed to add member:', err);
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    
    console.log('➖ Removing member:', userId);
    
    try {
      await projectsAPI.removeMember(projectId, userId);
      onUpdate(prev => prev.filter(m => m.id !== userId));
      toast.success('Member removed');
    } catch (err) {
      console.error('❌ Failed to remove member:', err);
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Members" width={440}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {isAdmin && nonMembers.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{ flex: 1 }}>
              <option value="">Add a member...</option>
              {nonMembers.map(u => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
            </Select>
            <Button loading={adding} onClick={addMember} disabled={!selectedUser}>Add</Button>
          </div>
        )}
        
        {isAdmin && nonMembers.length === 0 && allUsers.length > 0 && (
          <div style={{ padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            All users are already members of this project
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {members.length === 0 ? (
            <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No members yet
            </div>
          ) : (
            members.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <Avatar name={m.name} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{m.email}</div>
                </div>
                <Badge variant={m.role?.toLowerCase() || 'default'}>{m.role || 'Member'}</Badge>
                {isAdmin && (
                  <button onClick={() => removeMember(m.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 14, padding: 4, transition: 'opacity var(--transition)' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>✕</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
