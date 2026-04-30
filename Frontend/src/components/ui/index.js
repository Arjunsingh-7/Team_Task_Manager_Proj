import React from 'react';

// ============================================
// BUTTON COMPONENT
// ============================================
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  disabled, 
  icon,
  ...props 
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition)',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    fontFamily: 'inherit',
  };

  const variants = {
    primary: {
      background: 'var(--primary-600)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      background: 'var(--bg)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: 'var(--error)',
      color: '#ffffff',
    },
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '10px 20px', fontSize: '15px' },
  };

  const hoverStyles = variant === 'primary' 
    ? { background: 'var(--primary-700)' }
    : variant === 'secondary'
    ? { background: 'var(--gray-50)', borderColor: 'var(--gray-300)' }
    : variant === 'danger'
    ? { background: '#dc2626' }
    : { background: 'var(--gray-100)' };

  return (
    <button
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
      }}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.target.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.target.style, variants[variant]);
      }}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {icon && !loading && icon}
      {children}
    </button>
  );
}

// ============================================
// INPUT COMPONENT
// ============================================
export function Input({ label, error, icon, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {label && (
        <label style={{ 
          fontSize: '13px', 
          fontWeight: 500, 
          color: 'var(--text-primary)' 
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
          }}>
            {icon}
          </div>
        )}
        <input
          style={{
            width: '100%',
            padding: icon ? '10px 12px 10px 40px' : '10px 12px',
            fontSize: '14px',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg)',
            color: 'var(--text-primary)',
            transition: 'all var(--transition)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--primary-500)';
            e.target.style.boxShadow = error 
              ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
              : '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '12px', color: 'var(--error)' }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ============================================
// CARD COMPONENT
// ============================================
export function Card({ children, hover, ...props }) {
  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        transition: 'all var(--transition)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================
// BADGE COMPONENT
// ============================================
export function Badge({ children, variant = 'default', ...props }) {
  const variants = {
    default: { bg: 'var(--gray-100)', color: 'var(--text-secondary)' },
    success: { bg: 'var(--success-bg)', color: 'var(--success)' },
    warning: { bg: 'var(--warning-bg)', color: 'var(--warning)' },
    error: { bg: 'var(--error-bg)', color: 'var(--error)' },
    info: { bg: 'var(--info-bg)', color: 'var(--info)' },
    // Priority variants
    high: { bg: 'var(--error-bg)', color: 'var(--error)' },
    medium: { bg: 'var(--warning-bg)', color: 'var(--warning)' },
    low: { bg: 'var(--success-bg)', color: 'var(--success)' },
    // Role variants
    admin: { bg: 'var(--primary-100)', color: 'var(--primary-700)' },
    member: { bg: 'var(--gray-100)', color: 'var(--text-secondary)' },
  };

  // Fallback to default if variant doesn't exist
  const style = variants[variant] || variants.default;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        background: style.bg,
        color: style.color,
      }}
      {...props}
    >
      {children}
    </span>
  );
}

// ============================================
// AVATAR COMPONENT
// ============================================
export function Avatar({ name, src, size = 32 }) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-full)',
        background: src ? 'transparent' : 'var(--primary-100)',
        color: 'var(--primary-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  );
}

// ============================================
// SPINNER COMPONENT
// ============================================
export function Spinner({ size = 20 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
      }}
    />
  );
}

// ============================================
// SELECT COMPONENT
// ============================================
export function Select({ label, error, options = [], children, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {label && (
        <label style={{ 
          fontSize: '13px', 
          fontWeight: 500, 
          color: 'var(--text-primary)' 
        }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg)',
          color: 'var(--text-primary)',
          transition: 'all var(--transition)',
          outline: 'none',
          cursor: 'pointer',
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--primary-500)';
          e.target.style.boxShadow = error 
            ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
            : '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      >
        {children || options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: '12px', color: 'var(--error)' }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ============================================
// TEXTAREA COMPONENT
// ============================================
export function Textarea({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {label && (
        <label style={{ 
          fontSize: '13px', 
          fontWeight: 500, 
          color: 'var(--text-primary)' 
        }}>
          {label}
        </label>
      )}
      <textarea
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg)',
          color: 'var(--text-primary)',
          transition: 'all var(--transition)',
          outline: 'none',
          resize: 'vertical',
          minHeight: '100px',
          fontFamily: 'inherit',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--primary-500)';
          e.target.style.boxShadow = error 
            ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
            : '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '12px', color: 'var(--error)' }}>
          {error}
        </span>
      )}
    </div>
  );
}


// ============================================
// MODAL COMPONENT
// ============================================
export function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-4)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: 'var(--space-6)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gray-100)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: 'var(--space-6)',
          overflowY: 'auto',
          flex: 1,
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: 'var(--space-6)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'flex-end',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================
export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-16) var(--space-8)',
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: 'var(--space-4)',
        opacity: 0.5,
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: 'var(--space-2)',
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginBottom: action ? 'var(--space-6)' : 0,
          maxWidth: '400px',
          margin: '0 auto',
        }}>
          {description}
        </p>
      )}
      {action && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          {action}
        </div>
      )}
    </div>
  );
}
