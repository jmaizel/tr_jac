// frontend_B/src/pages/Profile.tsx - VERSION COMPATIBLE BACKEND

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getProfile();
        setProfile(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem' }}>⏳</div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', color: 'var(--danger)' }}>⚠️</div>
        <p style={{ color: 'var(--danger)' }}>{error || 'Profil introuvable'}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ 
              fontSize: '5rem',
              background: 'white',
              padding: '1rem',
              borderRadius: '50%',
              boxShadow: 'var(--shadow-lg)'
            }}>
              {profile.avatar || '😀'}
            </div>
            <div>
              <h1 className="page-title">{profile.displayName || profile.username}</h1>
              <p className="page-subtitle">@{profile.username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-2">
          
          {/* Informations du compte */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>👤 Informations</h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>👤 Nom d'utilisateur :</strong><br />
                <span style={{ color: 'var(--gray-700)' }}>{profile.username}</span>
              </div>
              
              <div>
                <strong>✉️ Email :</strong><br />
                <span style={{ color: 'var(--gray-700)' }}>{profile.email}</span>
              </div>
              
              <div>
                <strong>🏷️ Nom d'affichage :</strong><br />
                <span style={{ color: 'var(--gray-700)' }}>
                  {profile.displayName || 'Non défini'}
                </span>
              </div>
              
              <div>
                <strong>😀 Avatar :</strong><br />
                <span style={{ fontSize: '2rem' }}>{profile.avatar || '😀'}</span>
              </div>
              
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
                <strong>📅 Membre depuis :</strong><br />
                <span style={{ color: 'var(--gray-700)' }}>
                  {formatDate(profile.createdAt)}
                </span>
              </div>
              
              <div>
                <strong>🔄 Dernière mise à jour :</strong><br />
                <span style={{ color: 'var(--gray-700)' }}>
                  {formatDate(profile.updatedAt)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <button 
                onClick={() => navigate('/settings')}
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                ⚙️ Modifier le profil
              </button>
            </div>
          </div>

          {/* Statistiques - En attente du backend */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>📊 Statistiques</h2>
            
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem',
              color: 'var(--gray-600)' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <p>Les statistiques seront disponibles prochainement</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Endpoint /users/me/stats à implémenter dans le backend
              </p>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>⚡ Actions rapides</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/tournaments')}
              className="btn btn-secondary"
            >
              🏆 Voir les tournois
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="btn btn-secondary"
            >
              ⚙️ Paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;