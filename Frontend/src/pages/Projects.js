import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Modal, Input, Textarea, Spinner, EmptyState, Badge } from '../components/ui';
import toast from 'react-hot-toast';

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => {
    projectsAPI.list()
      .then(r => {
        const data = r.data.data || r.data;
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        toast.error('Failed to load projects');
      })
      .finally(() => setLoading(false));
  };
  
  useEffect(load, []);

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Delete project "${project.name}"? This will also delete its tasks.`)) return;

    try {
      await projectsAPI.delete(project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
      toast.success('Project deleted');
    } catch (err) {
      console.error('Delete project error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete project');
      load();
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 'var(--space-8)' 
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
            Projects
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {projects.length} active project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          + New Project
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
          <Spinner size={32} />
        </div>
      ) : !projects.length ? (
        <EmptyState
          icon="📁"
          title="No projects yet"
          description="Create your first project and start collaborating with your team."
          action={<Button onClick={() => setShowCreate(true)}>+ Create Project</Button>}
        />
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              user={user}
              onClick={() => navigate(`/projects/${p.id}`)}
              onDelete={() => handleDeleteProject(p)}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(p) => { 
          setProjects(prev => [p, ...prev]); 
          setShowCreate(false); 
        }}
      />
    </Layout>
  );
}

function ProjectCard({ project, user, onClick, onDelete, style }) {
  const isAdmin = project.adminId === user?.id;
  const total = project.taskCount || 0;
  const done = project.doneCount || 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card 
      hover 
      onClick={onClick} 
      style={{ 
        cursor: 'pointer', 
        animation: 'fadeIn 0.4s ease both', 
        ...style 
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: 'var(--space-4)' 
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-lg)',
          background: `hsl(${(project.id * 47) % 360}, 65%, 55%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: '#fff',
          fontWeight: 700,
        }}>
          {project.name?.[0]?.toUpperCase() || 'P'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Badge variant={isAdmin ? 'info' : 'default'}>
            {isAdmin ? 'Admin' : 'Member'}
          </Badge>
          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete project"
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--error)',
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              x
            </button>
          )}
        </div>
      </div>

      {/* Project Info */}
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: 600, 
        marginBottom: 'var(--space-2)',
        color: 'var(--text-primary)' 
      }}>
        {project.name}
      </h3>
      
      {project.description && (
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '13px', 
          marginBottom: 'var(--space-4)', 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          lineHeight: 1.5,
        }}>
          {project.description}
        </p>
      )}

      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '12px', 
          color: 'var(--text-tertiary)', 
          marginBottom: 'var(--space-2)' 
        }}>
          <span>{done}/{total} tasks completed</span>
          <span style={{ fontWeight: 600 }}>{pct}%</span>
        </div>
        <div style={{ 
          height: 6, 
          background: 'var(--gray-200)', 
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}>
          <div style={{ 
            height: '100%', 
            width: `${pct}%`, 
            background: pct === 100 ? 'var(--success)' : 'var(--primary-600)', 
            borderRadius: 'var(--radius-full)', 
            transition: 'width 0.6s ease' 
          }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-4)', 
        fontSize: '12px', 
        color: 'var(--text-tertiary)' 
      }}>
        <span>👥 {project.memberCount || 1} member{(project.memberCount || 1) !== 1 ? 's' : ''}</span>
        {project.createdAt && (
          <span>· {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        )}
      </div>
    </Card>
  );
}

function CreateProjectModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name.trim()) { 
      setErrors({ name: 'Project name is required' }); 
      return; 
    }
    
    setLoading(true);
    try {
      const res = await projectsAPI.create(form);
      const project = res.data.data || res.data;
      toast.success('Project created successfully!');
      onCreated(project);
      setForm({ name: '', description: '' });
      setErrors({});
    } catch (err) {
      console.error('Create project error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to create project';
      toast.error(errorMsg);
      setErrors({ submit: errorMsg });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Modal 
      isOpen={open} 
      onClose={onClose} 
      title="Create New Project"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSubmit}>
            Create Project
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Input 
          label="Project Name" 
          placeholder="e.g., Website Redesign" 
          value={form.name} 
          onChange={set('name')} 
          error={errors.name} 
          autoFocus 
        />
        <Textarea 
          label="Description (Optional)" 
          placeholder="What is this project about?" 
          value={form.description} 
          onChange={set('description')} 
        />
        {errors.submit && (
          <div style={{ 
            padding: 'var(--space-3)', 
            background: 'var(--error-bg)', 
            border: '1px solid var(--error)', 
            borderRadius: 'var(--radius-md)', 
            color: 'var(--error)', 
            fontSize: '13px' 
          }}>
            {errors.submit}
          </div>
        )}
      </div>
    </Modal>
  );
}
