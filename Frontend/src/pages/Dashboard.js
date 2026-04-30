import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, Badge, Avatar, Button } from '../components/ui';
import { dashboardAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadDashboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboard();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await dashboardAPI.get();
      const dashboardData = res.data.data || res.data;
      console.log('📊 Dashboard data loaded:', dashboardData);
      setData(dashboardData);
    } catch (err) {
      console.error('❌ Failed to load dashboard:', err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px' }} />
            <div style={{ color: '#64748b', fontSize: '14px' }}>Loading dashboard...</div>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = [
    { 
      label: 'Total Tasks', 
      value: data?.totalTasks || 0, 
      icon: '📋',
      subtext: 'All assigned tasks',
      color: '#667eea',
      bg: '#f0f4ff',
    },
    { 
      label: 'In Progress', 
      value: data?.tasksByStatus?.IN_PROGRESS || data?.inProgressTasks || 0, 
      icon: '⏳',
      subtext: 'Tasks in progress',
      color: '#f59e0b',
      bg: '#fef3c7',
    },
    { 
      label: 'Completed', 
      value: data?.tasksByStatus?.DONE || data?.doneTasks || 0, 
      icon: '✓',
      subtext: 'Tasks completed',
      color: '#10b981',
      bg: '#d1fae5',
    },
    { 
      label: 'Overdue', 
      value: data?.overdue?.length || data?.overdueTasks || 0, 
      icon: '⚠',
      subtext: 'Tasks overdue',
      color: '#ef4444',
      bg: '#fee2e2',
    },
  ];

  return (
    <Layout>
      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          color: '#1a202c', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p style={{ fontSize: '15px', color: '#64748b' }}>
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '32px' 
      }}>
        <Button 
          onClick={() => navigate('/projects')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '10px',
            background: '#fff',
            color: '#1a202c',
            border: '1px solid #e8eaf0',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📁</span> View Projects
        </Button>
        <Button 
          onClick={() => navigate('/my-tasks')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📋</span> My Tasks
        </Button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        {stats.map((stat, i) => (
          <div 
            key={i} 
            style={{
              background: '#fff',
              border: '1px solid #e8eaf0',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: 500, 
              color: '#64748b', 
              marginBottom: '4px' 
            }}>
              {stat.label}
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 700, 
              color: '#1a202c',
              marginBottom: '4px',
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {stat.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Overdue Tasks */}
        <div style={{
          background: '#fff',
          border: '1px solid #e8eaf0',
          borderRadius: '16px',
          padding: '24px',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '20px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>👥</span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c' }}>Overdue Tasks</h3>
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: '#fee2e2',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              {data?.overdue?.length || 0}
            </div>
          </div>

          {data?.overdue && data.overdue.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.overdue.slice(0, 5).map(task => (
                <div 
                  key={task.id} 
                  style={{ 
                    padding: '16px', 
                    background: '#f8f9fc', 
                    borderRadius: '12px',
                    border: '1px solid #e8eaf0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f4ff';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8f9fc';
                    e.currentTarget.style.borderColor = '#e8eaf0';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a202c' }}>
                      {task.title}
                    </div>
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: task.priority === 'HIGH' ? '#fee2e2' : task.priority === 'MEDIUM' ? '#fef3c7' : '#d1fae5',
                      color: task.priority === 'HIGH' ? '#ef4444' : task.priority === 'MEDIUM' ? '#f59e0b' : '#10b981',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      {task.priority}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px', 
              color: '#94a3b8' 
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: '#f0f4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}>
                🎉
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a202c', marginBottom: '4px' }}>
                No overdue tasks
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                Great! You're all caught up.
              </div>
            </div>
          )}
        </div>

        {/* Team Activity */}
        <div style={{
          background: '#fff',
          border: '1px solid #e8eaf0',
          borderRadius: '16px',
          padding: '24px',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '20px' 
          }}>
            <span style={{ fontSize: '20px' }}>👥</span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c' }}>
              Team Activity
            </h3>
          </div>

          {data?.byUser && data.byUser.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data.byUser.slice(0, 5).map((user, index) => (
                <div key={user.userEmail || index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar name={user.userName} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#1a202c',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {user.userName}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {user.taskCount} {user.taskCount === 1 ? 'task' : 'tasks'}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: '#f0f4ff',
                    color: '#667eea',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    {user.taskCount}
                  </div>
                </div>
              ))}
            </div>
          ) : data?.tasksByUser && data.tasksByUser.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data.tasksByUser.slice(0, 5).map((user, index) => (
                <div key={user.userEmail || index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar name={user.userName} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#1a202c',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {user.userName}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {user.taskCount} {user.taskCount === 1 ? 'task' : 'tasks'}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: '#f0f4ff',
                    color: '#667eea',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    {user.taskCount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px', 
              color: '#94a3b8' 
            }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: '#f0f4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}>
                💬
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                No activity yet
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                Team activity will appear here.
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
