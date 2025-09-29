// frontend_B/src/pages/Settings.tsx - VERSION COMPATIBLE BACKEND

import React, { useState, useEffect } from 'react';
import { userAPI, authAPI } from '../services/api';

interface UserSettings {
  username: string;
  displayName: string;
  email: string;
  avatar: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [userId, setUserId] = useState<number | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    username: '',
    displayName: '',
    email: '',
    avatar: '😀'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const avatars = ['😀', '😎', '🎮', '🕹️', '👤', '🎯', '🏆', '⚡', '🔥', '💎'];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await userAPI.getProfile();
        setUserId(response.data.id);
        setSettings({
          username: response.data.username,
          displayName: response.data.displayName || '',
          email: response.data.email,
          avatar: response.data.avatar || '😀'
        });
        // Note: twoFactorEnabled n'est pas dans ton backend User entity
        // setTwoFAEnabled(response.data.twoFactorEnabled || false);
      } catch (err: any) {
        setMessage({ type: 'error', text: 'Erreur de chargement' });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSaving(true);
    setMessage(null);

    try {
      await userAPI.updateProfile(userId, settings);
      setMessage({ type: 'success', text: 'Paramètres sauvegardés !' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur de sauvegarde' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggle2FA = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      if (!twoFAEnabled) {
        const response = await authAPI.enable2FA();
        setQrCode(response.data.qrCode);
        setTwoFAEnabled(true);
        setMessage({ type: 'success', text: '2FA activé ! Scannez le QR code.' });
      } else {
        await authAPI.disable2FA();
        setTwoFAEnabled(false);
        setQrCode(null);
        setMessage({ type: 'success', text: '2FA désactivé.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur 2FA' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem' }}>⏳</div>
        <p>Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">⚙️ Paramètres</h1>
          <p className="page-subtitle">Gérez votre compte</p>
        </div>
      </div>

      <div className="container">
        {message && (
          <div style={{
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: '2rem'
        }}>
          
          <div className="card" style={{ padding: '1rem', height: 'fit-content' }}>
            {['profile', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
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
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  background: activeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--gray-700)',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'profile' && '👤 Profil'}
                {tab === 'security' && '🔒 Sécurité'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave}>
            
            {activeTab === 'profile' && (
              <div className="card">
                <h2 style={{ marginBottom: '2rem' }}>👤 Profil</h2>
                
                <div className="form-group">
                  <label className="form-label">Avatar</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {avatars.map(avatar => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, avatar }))}
                        style={{
                          padding: '0.5rem',
                          border: settings.avatar === avatar ? '3px solid var(--primary)' : '2px solid var(--gray-300)',
                          borderRadius: '8px',
                          background: 'white',
                          fontSize: '2rem',
                          cursor: 'pointer'
                        }}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nom d'utilisateur</label>
                  <input
                    className="input"
                    value={settings.username}
                    onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nom d'affichage</label>
                  <input
                    className="input"
                    value={settings.displayName}
                    onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card">
                <h2 style={{ marginBottom: '2rem' }}>🔒 Sécurité</h2>
                
                <div style={{ 
                  padding: '1rem', 
                  background: twoFAEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 193, 7, 0.1)', 
                  borderRadius: '8px',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{twoFAEnabled ? '🔒' : '🔓'}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        2FA {twoFAEnabled ? 'Activé' : 'Désactivé'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                        {twoFAEnabled ? 'Compte sécurisé' : 'Activez pour plus de sécurité'}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className={`btn ${twoFAEnabled ? 'btn-danger' : 'btn-success'}`}
                    onClick={toggle2FA}
                    disabled={isSaving}
                  >
                    {isSaving ? '⏳...' : twoFAEnabled ? '❌ Désactiver' : '✅ Activer'}
                  </button>

                  {qrCode && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        📱 Scannez avec votre app :
                      </p>
                      <img src={qrCode} alt="QR Code 2FA" style={{ maxWidth: '200px' }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ 
              marginTop: '2rem',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button type="button" className="btn btn-secondary">
                🔄 Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;