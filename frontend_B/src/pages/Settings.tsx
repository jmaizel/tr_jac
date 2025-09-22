// frontend_B/src/pages/Settings.tsx - PAGE DES PARAMÈTRES

import React, { useState } from 'react';
import { useUser, UpdateProfileData } from '../contexts/UserContext';

const Settings: React.FC = () => {
  const { user, updateProfile } = useUser();
  
  // États du formulaire
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    username: user?.username || '',
    email: user?.email || '',
    displayName: user?.displayName || '',
    avatar: user?.avatar || '',
  });

  // État pour les préférences
  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'light',
    notifications: true,
    soundEnabled: true,
    emailUpdates: false,
  });

  if (!user) {
    return (
      <div>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">⚙️ Paramètres</h1>
            <p className="page-subtitle">Vous devez être connecté pour accéder aux paramètres</p>
          </div>
        </section>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    console.log('💾 Préférences sauvegardées:', preferences);
    // TODO: Sauvegarder les préférences dans le backend
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      displayName: user.displayName || '',
      avatar: user.avatar || '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header */}
      <section className="page-header" style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        color: 'white',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            ⚙️ Paramètres
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.1rem', opacity: '0.9' }}>
            Personnalisez votre expérience Transcendence
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          
          {/* Section Profil */}
          <div className="settings-section" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#2d3748' }}>
              👤 Informations du profil
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Avatar */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#4a5568' }}>
                  Avatar
                </label>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="text"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      placeholder="Emoji ou URL"
                      style={{
                        flex: '1',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    />
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#667eea',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {formData.avatar || '👤'}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#667eea',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {user.avatar || '👤'}
                    </div>
                    <span style={{ color: '#4a5568' }}>{user.avatar || 'Aucun avatar'}</span>
                  </div>
                )}
              </div>

              {/* Nom d'utilisateur */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#4a5568' }}>
                  Nom d'utilisateur
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                ) : (
                  <span style={{ color: '#4a5568' }}>{user.username}</span>
                )}
              </div>

              {/* Nom d'affichage */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#4a5568' }}>
                  Nom d'affichage
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Nom complet ou surnom"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                ) : (
                  <span style={{ color: '#4a5568' }}>{user.displayName || 'Non défini'}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#4a5568' }}>
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                ) : (
                  <span style={{ color: '#4a5568' }}>{user.email}</span>
                )}
              </div>

              {/* Boutons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background 0.2s'
                      }}
                    >
                      💾 Sauvegarder
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#e2e8f0',
                        color: '#4a5568',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background 0.2s'
                      }}
                    >
                      ❌ Annuler
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'background 0.2s'
                    }}
                  >
                    ✏️ Modifier
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section Préférences */}
          <div className="settings-section" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#2d3748' }}>
              🎨 Préférences
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Langue */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#4a5568' }}>🌍 Langue</strong>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>Langue de l'interface</div>
                </div>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: 'white'
                  }}
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>

              {/* Thème */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#4a5568' }}>🎨 Thème</strong>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>Apparence de l'interface</div>
                </div>
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: 'white'
                  }}
                >
                  <option value="light">☀️ Clair</option>
                  <option value="dark">🌙 Sombre</option>
                  <option value="auto">🔄 Automatique</option>
                </select>
              </div>

              {/* Notifications */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#4a5568' }}>🔔 Notifications</strong>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>Recevoir des notifications push</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: preferences.notifications ? '#667eea' : '#ccc',
                    borderRadius: '24px',
                    transition: '0.4s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: preferences.notifications ? '29px' : '3px',
                      bottom: '3px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: '0.4s',
                    }}></span>
                  </span>
                </label>
              </div>

              {/* Sons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#4a5568' }}>🔊 Sons</strong>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>Activer les effets sonores</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => handlePreferenceChange('soundEnabled', e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: preferences.soundEnabled ? '#667eea' : '#ccc',
                    borderRadius: '24px',
                    transition: '0.4s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: preferences.soundEnabled ? '29px' : '3px',
                      bottom: '3px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: '0.4s',
                    }}></span>
                  </span>
                </label>
              </div>

              {/* Emails */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#4a5568' }}>📧 Emails</strong>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>Recevoir les mises à jour par email</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={preferences.emailUpdates}
                    onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: preferences.emailUpdates ? '#667eea' : '#ccc',
                    borderRadius: '24px',
                    transition: '0.4s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: preferences.emailUpdates ? '29px' : '3px',
                      bottom: '3px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: '0.4s',
                    }}></span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section Sécurité */}
          <div className="settings-section" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#2d3748' }}>
              🔒 Sécurité
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                padding: '1rem',
                background: '#f7fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#4a5568' }}>🔐 Authentification à deux facteurs</strong>
                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>Ajoutez une couche de sécurité supplémentaire</div>
                  </div>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    Configurer
                  </button>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: '#f7fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#4a5568' }}>🔑 Changer le mot de passe</strong>
                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>Modifiez votre mot de passe actuel</div>
                  </div>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    Modifier
                  </button>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: '#fed7d7',
                borderRadius: '8px',
                border: '1px solid #feb2b2'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#c53030' }}>🗑️ Supprimer le compte</strong>
                    <div style={{ fontSize: '0.9rem', color: '#9b2c2c' }}>Cette action est irréversible</div>
                  </div>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section Statistiques */}
          <div className="settings-section" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#2d3748' }}>
              📊 Statistiques du compte
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>{user.totalGames}</div>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Parties jouées</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#48bb78' }}>{user.gamesWon}</div>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Victoires</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ed8936' }}>{user.winRate.toFixed(1)}%</div>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Taux de victoire</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#9f7aea' }}>{user.totalScore}</div>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Score total</div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Settings;