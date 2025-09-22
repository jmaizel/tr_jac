// frontend_B/src/components/Navigation.tsx - VERSION SIMPLIFIÉE POUR TEST

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Utilisateur en dur pour tester
  const user = {
    id: 1,
    username: 'Jacob',
    email: 'jacob@ecole42.fr',
    avatar: '👨‍💻',
    displayName: 'Jacob Maizel',
    totalScore: 1250,
    gamesWon: 15,
    winRate: 75.5,
    totalGames: 20
  };
  const isLoggedIn = true;

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/tournaments', label: 'Tournaments', icon: '🏆' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer le dropdown quand on navigue
  useEffect(() => {
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleProfileClick = () => {
    console.log('🖱️ Clic sur le profil, dropdown ouvert:', !isProfileDropdownOpen);
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleDropdownItemClick = (action: string) => {
    console.log('🖱️ Action dropdown:', action);
    setIsProfileDropdownOpen(false);
    
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/profile');
        break;
      case 'logout':
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
          console.log('🚪 Déconnexion simulée');
        }
        break;
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🏓</span>
          <span className="brand-text">Transcendence</span>
        </Link>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-user">
          {isLoggedIn && user ? (
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <button 
                className="profile-button"
                onClick={handleProfileClick}
                aria-label="Menu profil"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '25px',
                  padding: '0.25rem 0.75rem 0.25rem 0.25rem',
                  cursor: 'pointer'
                }}
              >
                <span className="user-avatar" style={{
                  width: '36px',
                  height: '36px',
                  background: '#667eea',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600'
                }}>
                  {user.avatar}
                </span>
                <span className="user-name" style={{ fontWeight: '600', color: '#4a5568' }}>
                  {user.username}
                </span>
                <span className={`dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`} style={{
                  fontSize: '0.75rem',
                  color: '#a0aec0',
                  transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}>
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="profile-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  width: '280px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  zIndex: 1001,
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div className="dropdown-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <div className="dropdown-avatar" style={{
                      width: '48px',
                      height: '48px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      {user.avatar}
                    </div>
                    <div className="dropdown-user-info" style={{ flex: '1' }}>
                      <div className="dropdown-username" style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        {user.displayName || user.username}
                      </div>
                      <div className="dropdown-email" style={{ fontSize: '0.85rem', opacity: '0.9' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider" style={{ height: '1px', background: '#e2e8f0', margin: '0.25rem 0' }}></div>
                  
                  <div className="dropdown-items" style={{ padding: '0.5rem 0' }}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleDropdownItemClick('profile')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        color: '#4a5568',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        textAlign: 'left'
                      }}
                    >
                      <span className="dropdown-icon">👤</span>
                      <span>Mon Profil</span>
                    </button>
                    
                    <button
                      className="dropdown-item"
                      onClick={() => handleDropdownItemClick('settings')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        color: '#4a5568',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        textAlign: 'left'
                      }}
                    >
                      <span className="dropdown-icon">⚙️</span>
                      <span>Paramètres</span>
                    </button>
                    
                    <div className="dropdown-divider" style={{ height: '1px', background: '#e2e8f0', margin: '0.25rem 0' }}></div>
                    
                    <div className="dropdown-stats" style={{ padding: '0.5rem 1rem', background: 'rgba(102, 126, 234, 0.05)' }}>
                      <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0', fontSize: '0.85rem' }}>
                        <span className="stat-icon">🏆</span>
                        <span className="stat-text" style={{ color: '#6b7280' }}>
                          Score: <strong style={{ color: '#667eea' }}>{user.totalScore}</strong>
                        </span>
                      </div>
                      <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0', fontSize: '0.85rem' }}>
                        <span className="stat-icon">🎯</span>
                        <span className="stat-text" style={{ color: '#6b7280' }}>
                          Victoires: <strong style={{ color: '#667eea' }}>{user.gamesWon}</strong>
                        </span>
                      </div>
                      {user.totalGames > 0 && (
                        <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0', fontSize: '0.85rem' }}>
                          <span className="stat-icon">📈</span>
                          <span className="stat-text" style={{ color: '#6b7280' }}>
                            Taux: <strong style={{ color: '#667eea' }}>{user.winRate.toFixed(1)}%</strong>
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="dropdown-divider" style={{ height: '1px', background: '#e2e8f0', margin: '0.25rem 0' }}></div>
                    
                    <button
                      className="dropdown-item logout"
                      onClick={() => handleDropdownItemClick('logout')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        color: '#e53e3e',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        textAlign: 'left'
                      }}
                    >
                      <span className="dropdown-icon">🚪</span>
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              <span>🔐</span>
              <span>Se connecter</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;