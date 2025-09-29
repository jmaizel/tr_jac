// frontend_B/src/pages/Tournaments.tsx - VERSION PROPRE PRÊTE BACKEND

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI } from '../services/api';

interface Tournament {
  id: number;
  name: string;
  description: string;
  type: 'single_elimination' | 'double_elimination' | 'round_robin';
  status: 'pending' | 'in_progress' | 'completed';
  maxParticipants: number;
  currentParticipants: number;
  createdAt: string;
  startDate?: string;
  creator: {
    username: string;
  };
}

const Tournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        const params: any = {};

        if (filters.status !== 'all') {
          params.status = filters.status;
        }
        if (filters.type !== 'all') {
          params.type = filters.type;
        }

        const response = await tournamentAPI.getTournaments(params);
        setTournaments(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, [filters.status, filters.type]);

  // Filtrage côté client pour la recherche
  const filteredTournaments = tournaments.filter(tournament => 
    tournament.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    tournament.description.toLowerCase().includes(filters.search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: '⏳ En attente', color: 'var(--warning)' },
      in_progress: { text: '▶️ En cours', color: 'var(--success)' },
      completed: { text: '✅ Terminé', color: 'var(--gray-600)' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getTypeName = (type: string) => {
    const types = {
      single_elimination: '🏆 Élimination simple',
      double_elimination: '🏆🏆 Élimination double',
      round_robin: '🔄 Round Robin'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="tournaments-page">
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="page-title">🏆 Tournois</h1>
              <p className="page-subtitle">Rejoignez ou créez un tournoi</p>
            </div>
            <Link to="/create-tournament" className="btn btn-primary">
              ➕ Créer un tournoi
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filtres */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>🔍 Filtres</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <div className="form-group">
              <label className="form-label">Statut</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">📊 Tous</option>
                <option value="pending">⏳ En attente</option>
                <option value="in_progress">▶️ En cours</option>
                <option value="completed">✅ Terminés</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="input"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="all">🎮 Tous</option>
                <option value="single_elimination">🏆 Élimination simple</option>
                <option value="double_elimination">🏆🏆 Élimination double</option>
                <option value="round_robin">🔄 Round Robin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Recherche</label>
              <input
                className="input"
                placeholder="Nom du tournoi..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Liste des tournois */}
        {isLoading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem' }}>⏳</div>
            <p>Chargement des tournois...</p>
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', color: 'var(--danger)' }}>⚠️</div>
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem' }}>😕</div>
            <p style={{ color: 'var(--gray-600)' }}>Aucun tournoi trouvé</p>
            <Link to="/create-tournament" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Créer le premier tournoi
            </Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {filteredTournaments.map(tournament => {
              const statusBadge = getStatusBadge(tournament.status);
              const progress = (tournament.currentParticipants / tournament.maxParticipants) * 100;

              return (
                <div key={tournament.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, flex: 1 }}>{tournament.name}</h3>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      background: `${statusBadge.color}20`,
                      color: statusBadge.color
                    }}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <p style={{ color: 'var(--gray-600)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {tournament.description || 'Pas de description'}
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <span>{getTypeName(tournament.type)}</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      background: 'var(--gray-200)', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${progress}%`, 
                        height: '100%', 
                        background: progress >= 100 ? 'var(--danger)' : 'var(--success)',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--gray-200)'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                      Par {tournament.creator.username}
                    </span>
                    <Link 
                      to={`/tournaments/${tournament.id}`} 
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;