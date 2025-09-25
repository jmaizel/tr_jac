// frontend_B/src/pages/Settings.tsx - PAGE PARAMÈTRES UTILISATEUR

import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

interface SettingsForm {
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  notifications: {
    gameInvitations: boolean;
    tournamentUpdates: boolean;
    friendRequests: boolean;
    emailNotifications: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showOnlineStatus: boolean;
    allowGameInvitations: boolean;
  };
  gamePreferences: {
    defaultGameMode: 'classic' | 'speed' | 'custom';
    soundEnabled: boolean;
    animationsEnabled: boolean;
  };
}

interface TwoFASettings {
  isEnabled: boolean;
  qrCode?: string;
  backupCodes?: string[];
}

const Settings: React.FC = () => {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'game'>('profile');
  const [formData, setFormData] = useState<SettingsForm>({
    username: user?.username || '',
    displayName: user?.displayName || '',
    email: user?.email || '',
    avatar: user?.avatar || '😀',
    notifications: {
      gameInvitations: true,
      tournamentUpdates: true,
      friendRequests: true,
      emailNotifications: false
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: true,
      allowGameInvitations: true
    },
    gamePreferences: {
      defaultGameMode: 'classic',
      soundEnabled: true,
      animationsEnabled: true
    }
  });

  const [twoFA, setTwoFA] = useState<TwoFASettings>({
    isEnabled: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Avatars disponibles
  const availableAvatars = ['😀', '😎', '🎮', '🕹️', '👤', '🎯', '🏆', '⚡', '🔥', '💎', '🎪', '🎨'];

  // Gestion des changements
  const handleChange = (section: keyof SettingsForm, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  // Sauvegarde des paramètres
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // TODO: Appel API backend pour sauvegarder
      console.log('Saving settings:', formData);
      
      // Simulation
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' });
        setIsLoading(false);
        
        // Mise à jour du context utilisateur
        updateUser({
          ...user!,
          username: formData.username,
          displayName: formData.displayName,
          avatar: formData.avatar
        });
      }, 1000);

    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
      setIsLoading(false);
    }
  };

  // Activation/désactivation 2FA
  const toggle2FA = async () => {
    setIsLoading(true);

    try {
      if (!twoFA.isEnabled) {
        // Activation 2FA - générer QR code
        console.log('Enabling 2FA...');
        setTimeout(() => {
          setTwoFA({
            isEnabled: true,
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUGAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // QR code simulé
            backupCodes: ['ABC123', 'DEF456', 'GHI789', 'JKL012']
          });
          setMessage({ type: 'success', text: '2FA activé ! Scannez le QR code avec votre app.' });
          setIsLoading(false);
        }, 1000);
      } else {
        // Désactivation 2FA
        console.log('Disabling 2FA...');
        setTimeout(() => {
          setTwoFA({ isEnabled: false });
          setMessage({ type: 'success', text: '2FA désactivé.' });
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la configuration 2FA.' });
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: '👤 Profil', icon: '👤' },
    { id: 'security', label: '🔒 Sécurité', icon: '🔒' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'game', label: '🎮 Jeu', icon: '🎮' }
  ] as const;

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">⚙️ Paramètres</h1>
          <p className="page-subtitle">
            Personnalisez votre expérience Transcendence
          </p>
        </div>
      </div>

      <div className="container">
        {/* Messages */}
        {message && (
          <div style={{
            background: message.type === 'success' 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        <div className="settings-layout" style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: '2rem'
        }}>
          
          {/* Navigation des onglets */}
          <div className="settings-nav">
            <div className="card" style={{ padding: '1rem' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                    background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--gray-700)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="settings-content">
            <form onSubmit={handleSave}>
              
              {/* ONGLET PROFIL */}
              {activeTab === 'profile' && (
                <div className="card">
                  <h2 style={{ marginBottom: '2rem' }}>👤 Informations du profil</h2>
                  
                  {/* Avatar */}
                  <div className="form-group">
                    <label className="form-label">Avatar</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {availableAvatars.map(avatar => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => handleChange('avatar', '', avatar)}
                          style={{
                            padding: '0.5rem',
                            border: formData.avatar === avatar ? '3px solid var(--primary)' : '2px solid var(--gray-300)',
                            borderRadius: '8px',
                            background: 'white',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nom d'utilisateur */}
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      Nom d'utilisateur
                    </label>
                    <input
                      id="username"
                      className="input"
                      value={formData.username}
                      onChange={(e) => handleChange('username', '', e.target.value)}
                      placeholder="Votre nom d'utilisateur"
                    />
                  </div>

                  {/* Nom d'affichage */}
                  <div className="form-group">
                    <label htmlFor="displayName" className="form-label">
                      Nom d'affichage
                    </label>
                    <input
                      id="displayName"
                      className="input"
                      value={formData.displayName}
                      onChange={(e) => handleChange('displayName', '', e.target.value)}
                      placeholder="Comment vous voulez apparaître"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Adresse email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="input"
                      value={formData.email}
                      onChange={(e) => handleChange('email', '', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ONGLET SÉCURITÉ */}
              {activeTab === 'security' && (
                <div className="card">
                  <h2 style={{ marginBottom: '2rem' }}>🔒 Sécurité du compte</h2>
                  
                  {/* Changement de mot de passe */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Mot de passe</h3>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                    >
                      🔑 Changer le mot de passe
                    </button>
                    
                    {showPasswordChange && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--gray-100)', borderRadius: '8px' }}>
                        <div className="form-group">
                          <label className="form-label">Mot de passe actuel</label>
                          <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Nouveau mot de passe</label>
                          <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Confirmer le nouveau mot de passe</label>
                          <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" className="btn btn-success">✅ Confirmer</button>
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => setShowPasswordChange(false)}
                          >
                            ❌ Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Authentification 2FA */}
                  <div>
                    <h3 style={{ marginBottom: '1rem' }}>Authentification à deux facteurs (2FA)</h3>
                    <div style={{ 
                      padding: '1rem', 
                      background: twoFA.isEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 193, 7, 0.1)', 
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>
                          {twoFA.isEnabled ? '🔒' : '🔓'}
                        </span>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>
                            2FA {twoFA.isEnabled ? 'Activé' : 'Désactivé'}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                            {twoFA.isEnabled 
                              ? 'Votre compte est sécurisé avec 2FA' 
                              : 'Activez 2FA pour plus de sécurité'
                            }
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        className={`btn ${twoFA.isEnabled ? 'btn-danger' : 'btn-success'}`}
                        onClick={toggle2FA}
                        disabled={isLoading}
                      >
                        {isLoading ? '⏳ Configuration...' : 
                         twoFA.isEnabled ? '❌ Désactiver 2FA' : '✅ Activer 2FA'}
                      </button>

                      {/* QR Code pour activation 2FA */}
                      {twoFA.isEnabled && twoFA.qrCode && (
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                            📱 Scannez ce QR code avec votre application d'authentification :
                          </p>
                          <div style={{ 
                            width: '200px', 
                            height: '200px', 
                            background: '#f0f0f0', 
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed var(--gray-400)',
                            borderRadius: '8px'
                          }}>
                            📱 QR Code
                          </div>
                          
                          {twoFA.backupCodes && (
                            <div style={{ marginTop: '1rem' }}>
                              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                🔑 Codes de secours (sauvegardez-les) :
                              </p>
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(2, 1fr)', 
                                gap: '0.25rem',
                                fontSize: '0.8rem',
                                fontFamily: 'monospace'
                              }}>
                                {twoFA.backupCodes.map((code, index) => (
                                  <span key={index} style={{ 
                                    background: 'white', 
                                    padding: '0.25rem',
                                    borderRadius: '4px'
                                  }}>
                                    {code}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="card">
                  <h2 style={{ marginBottom: '2rem' }}>🔔 Préférences de notifications</h2>
                  
                  {Object.entries(formData.notifications).map(([key, value]) => (
                    <div key={key} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'var(--gray-100)',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {key === 'gameInvitations' && '🎮 Invitations de jeu'}
                          {key === 'tournamentUpdates' && '🏆 Mises à jour des tournois'}
                          {key === 'friendRequests' && '👥 Demandes d\'amis'}
                          {key === 'emailNotifications' && '📧 Notifications par email'}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                          {key === 'gameInvitations' && 'Recevoir les invitations de partie'}
                          {key === 'tournamentUpdates' && 'Être notifié des tournois'}
                          {key === 'friendRequests' && 'Notifications d\'amis'}
                          {key === 'emailNotifications' && 'Recevoir des emails'}
                        </div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleChange('notifications', key, e.target.checked)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span>{value ? '✅' : '❌'}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* ONGLET JEU */}
              {activeTab === 'game' && (
                <div className="card">
                  <h2 style={{ marginBottom: '2rem' }}>🎮 Préférences de jeu</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Mode de jeu par défaut</label>
                    <select
                      className="input"
                      value={formData.gamePreferences.defaultGameMode}
                      onChange={(e) => handleChange('gamePreferences', 'defaultGameMode', e.target.value)}
                    >
                      <option value="classic">🎯 Classique</option>
                      <option value="speed">⚡ Rapide</option>
                      <option value="custom">⚙️ Personnalisé</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Options d'affichage</h3>
                    
                    {Object.entries(formData.gamePreferences).slice(1).map(([key, value]) => (
                      <div key={key} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'var(--gray-100)',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>
                            {key === 'soundEnabled' && '🔊 Sons activés'}
                            {key === 'animationsEnabled' && '✨ Animations activées'}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                            {key === 'soundEnabled' && 'Effets sonores du jeu'}
                            {key === 'animationsEnabled' && 'Effets visuels et animations'}
                          </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => handleChange('gamePreferences', key, e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          <span>{value ? '✅' : '❌'}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons de sauvegarde */}
              <div className="settings-actions" style={{ 
                marginTop: '2rem',
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => window.location.reload()}
                >
                  🔄 Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;