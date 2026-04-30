import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';

// ============================================
// MODERN LAYOUT WITH NAVBAR & SIDEBAR
// ============================================

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '⊞', iconStyle: { fontSize: '20px' } },
    { path: '/my-tasks', label: 'My Tasks', icon: '✓', iconStyle: { fontSize: '18px' } },
    { path: '/projects', label: 'Projects', icon: '📁', iconStyle: { fontSize: '16px' } },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fc' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: '260px',
        background: '#fff',
        borderRight: '1px solid #e8eaf0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #e8eaf0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}>
              T
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c' }}>
              TaskFlow
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 500,
                color: isActive(item.path) ? '#667eea' : '#64748b',
                background: isActive(item.path) ? '#f0f4ff' : 'transparent',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = '#f8f9fc';
                  e.currentTarget.style.color = '#1a202c';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              {isActive(item.path) && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '24px',
                  background: '#667eea',
                  borderRadius: '0 4px 4px 0',
                }} />
              )}
              <span style={item.iconStyle}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e8eaf0',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: '#f8f9fc',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f4ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f8f9fc';
          }}
          onClick={handleLogout}
          >
            <Avatar name={user?.name} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a202c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#94a3b8' }}>⌄</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{
        marginLeft: '260px',
        flex: 1,
        minHeight: '100vh',
        background: '#f8f9fc',
      }}>
        {/* TOP NAVBAR */}
        <header style={{
          height: '72px',
          background: '#fff',
          borderBottom: '1px solid #e8eaf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a202c' }}>
              {navItems.find(item => isActive(item.path))?.label || 'TaskFlow'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#f8f9fc',
              borderRadius: '10px',
              border: '1px solid #e8eaf0',
              minWidth: '280px',
            }}>
              <span style={{ fontSize: '16px', color: '#94a3b8' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search..." 
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#1a202c',
                  width: '100%',
                }}
              />
            </div>

            {/* Notification Bell */}
            <div style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#f8f9fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fc'}
            >
              <span style={{ fontSize: '18px' }}>🔔</span>
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid #fff',
              }} />
            </div>

            {/* User Avatar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px 6px 6px',
              background: '#f8f9fc',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fc'}
            >
              <Avatar name={user?.name} size={32} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a202c' }}>
                {user?.name?.split(' ')[0]}
              </span>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>⌄</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
