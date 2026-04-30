import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../ui';
import toast from 'react-hot-toast';

export default function AuthPage({ mode = 'login' }) {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      console.log('Submitting form:', { name: form.name, email: form.email, isLogin });
      if (isLogin) {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await signup(form.name, form.email, form.password);
        toast.success('Account created!');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Form submission error:', err);
      const msg = err.response?.data?.message || err.message || (isLogin ? 'Invalid credentials' : 'Signup failed');
      toast.error(msg);
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => { 
    setForm(f => ({ ...f, [k]: e.target.value })); 
    setErrors(er => ({ ...er, [k]: '' })); 
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      {/* LEFT SIDE - BRANDING */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 60px',
        color: '#fff',
      }}>
        <div style={{ maxWidth: 520 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#667eea',
              fontSize: '24px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              T
            </div>
            <span style={{ fontSize: '28px', fontWeight: 700 }}>
              TaskFlow
            </span>
          </div>

          {/* Heading */}
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 700, 
            marginBottom: '20px',
            lineHeight: 1.2,
          }}>
            Manage your team's work with <span style={{ color: '#a8d5ff' }}>clarity</span>
          </h1>
          
          <p style={{ 
            fontSize: '18px', 
            lineHeight: 1.7,
            marginBottom: '48px',
            opacity: 0.95,
          }}>
            TaskFlow helps teams stay organized, track progress, and deliver projects on time. Simple, powerful, and built for modern teams.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '✓', text: 'Organize tasks and projects in one place', subtext: 'Keep everything structured and easy to find.' },
              { icon: '👥', text: 'Collaborate with your team in real-time', subtext: 'Work together seamlessly from anywhere.' },
              { icon: '📊', text: 'Track progress with visual dashboards', subtext: 'Get insights and stay ahead of deadlines.' },
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0,
                }}>
                  {feature.icon}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                    {feature.text}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.85 }}>
                    {feature.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Form Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            }}>
              <span style={{ fontSize: '28px' }}>🔒</span>
            </div>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 700, 
              color: '#1a202c', 
              marginBottom: '8px' 
            }}>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{ fontSize: '15px', color: '#718096' }}>
              {isLogin ? 'Sign in to continue to TaskFlow' : 'Get started with TaskFlow today'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete={isLogin ? "on" : "off"} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                autoComplete="off"
              />
            )}
            
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              autoComplete={isLogin ? "email" : "off"}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 characters)'}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />

            {errors.submit && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#fee2e2', 
                border: '1px solid #ef4444', 
                borderRadius: '10px', 
                color: '#dc2626', 
                fontSize: '14px' 
              }}>
                {errors.submit}
              </div>
            )}

            <Button 
              type="submit" 
              loading={loading} 
              style={{ 
                width: '100%', 
                padding: '14px', 
                fontSize: '16px', 
                fontWeight: 600,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          {/* Switch mode */}
          <div style={{ 
            marginTop: '32px', 
            textAlign: 'center', 
            fontSize: '15px', 
            color: '#718096' 
          }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link 
              to={isLogin ? '/signup' : '/login'} 
              style={{ 
                color: '#667eea', 
                fontWeight: 600, 
                textDecoration: 'none' 
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
