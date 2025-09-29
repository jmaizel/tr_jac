// frontend_B/src/pages/Login.tsx - VERSION PROPRE PRÊTE BACKEND

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      
      if (response.data.requires2FA) {
        setShowTwoFA(true);
        setIsLoading(false);
        return;
      }

      localStorage.setItem('access_token', response.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      setIsLoading(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.verify2FA(twoFACode);
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code 2FA incorrect');
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: '42' | 'google' | 'github') => {
    const redirectUri = window.location.origin + '/auth/callback';
    const oauthUrls = {
      '42': `${import.meta.env.VITE_API_URL}/auth/42?redirect_uri=${redirectUri}`,
      'google': `${import.meta.env.VITE_API_URL}/auth/google?redirect_uri=${redirectUri}`,
      'github': `${import.meta.env.VITE_API_URL}/auth/github?redirect_uri=${redirectUri}`
    };
    
    window.location.href = oauthUrls[provider];
  };

  return (
    <div className="login-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">🔐 Connexion</h1>
          <p className="page-subtitle">Connectez-vous à Transcendence</p>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '500px', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            
            {!showTwoFA ? (
              <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Se connecter</h2>

                {error && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: '2rem' }}>
                  <button onClick={() => handleOAuth('42')} disabled={isLoading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', border: 'none', background: '#00babc', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🚀</span>
                    Se connecter avec 42
                  </button>

                  <button onClick={() => handleOAuth('google')} disabled={isLoading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', border: '2px solid #4285f4', background: 'white', color: '#4285f4', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔍</span>
                    Se connecter avec Google
                  </button>

                  <button onClick={() => handleOAuth('github')} disabled={isLoading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', border: 'none', background: '#333', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <span style={{ fontSize: '1.2rem' }}>🐙</span>
                    Se connecter avec GitHub
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0', color: 'var(--gray-500)' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--gray-300)' }}></div>
                  <span>ou</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--gray-300)' }}></div>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
                    {isLoading ? '⏳ Connexion...' : '🔐 Se connecter'}
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                  <a href="/forgot-password" style={{ color: 'var(--primary)' }}>Mot de passe oublié ?</a>
                </div>
              </div>

            ) : (
              <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🔒 Authentification 2FA</h2>
                <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '0.9rem' }}>Entrez le code de votre application</p>

                {error && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handle2FA}>
                  <div className="form-group">
                    <label htmlFor="twoFACode" className="form-label">Code (6 chiffres)</label>
                    <input id="twoFACode" type="text" className="input" value={twoFACode} onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" maxLength={6} required style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.2rem' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowTwoFA(false); setTwoFACode(''); setError(''); }} style={{ flex: 1 }}>← Retour</button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading || twoFACode.length !== 6} style={{ flex: 2 }}>
                      {isLoading ? '⏳ Vérification...' : '✅ Vérifier'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;