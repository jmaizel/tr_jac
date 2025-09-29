// frontend_B/src/pages/Home.tsx - VERSION PROPRE PRÊTE BACKEND

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI, leaderboardAPI } from '../services/api';

interface QuickStats {
  activeTournaments: number;
  onlinePlayers: number;
  totalMatches: number;
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Créer endpoint pour les stats de la home page
        // const response = await api.get('/stats/home');
        // setStats(response.data);
        
        // Pour l'instant, on laisse null
        setStats(null);
      } catch (err) {
        console.error('Erreur chargement stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            🏓 Transcendence
          </h1>
          <p style={{ 
            fontSize: '1.5rem', 
            marginBottom: '2rem',
            opacity: 0.95
          }}>
            Le meilleur jeu de Pong en ligne
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn" style={{ 
              background: 'white', 
              color: 'var(--primary)',
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            }}>
              🚀 Commencer à jouer
            </Link>
            <Link to="/tournaments" className="btn" style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white',
              border: '2px solid white',
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            }}>
              🏆 Voir les tournois
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '3rem' }}>
        {/* Stats rapides */}
        {!isLoading && stats && (
          <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {stats.activeTournaments}
              </div>
              <div style={{ color: 'var(--gray-600)' }}>Tournois actifs</div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                {stats.onlinePlayers}
              </div>
              <div style={{ color: 'var(--gray-600)' }}>Joueurs en ligne</div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎮</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                {stats.totalMatches}
              </div>
              <div style={{ color: 'var(--gray-600)' }}>Parties jouées</div>
            </div>
          </div>
        )}

        {/* Fonctionnalités */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
            ✨ Fonctionnalités
          </h2>
          <div className="grid grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Jeu en temps réel</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                Affrontez vos amis dans des parties de Pong multijoueur en temps réel
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Tournois</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                Créez et participez à des tournois avec système de brackets
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Classement</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                Suivez vos stats et grimpez dans le classement mondial
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
              <h3 style={{ marginBottom: '0.5rem' }}>OAuth & 2FA</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                Connexion sécurisée avec 42, Google, GitHub et authentification 2FA
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Social</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                Ajoutez des amis, chattez et suivez leurs performances
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Multilingue</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                Interface disponible en français et anglais
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="card" style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>
            Prêt à jouer ? 🎮
          </h2>
          <p style={{ 
            color: 'var(--gray-600)', 
            marginBottom: '2rem',
            fontSize: '1.1rem'
          }}>
            Rejoignez des milliers de joueurs et montrez vos compétences
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{ 
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            }}>
              🚀 S'inscrire gratuitement
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary" style={{ 
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            }}>
              📊 Voir le classement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;