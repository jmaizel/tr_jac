// frontend_B/src/pages/TournamentDetail.tsx - VERSION PROPRE PRÊTE BACKEND

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tournamentAPI } from '../services/api';

interface Tournament {
  id: number;
  name: string;
  description: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed';
  maxParticipants: number;
  currentParticipants: number;
  createdAt: string;
  startDate?: string;
  creator: {
    id: string;
    username: string;
  };
  participants: Array<{
    id: string;
    username: string;
    avatar: string;
  }>;
}

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Vérifier si l'utilisateur est participant
  const [isParticipant, setIsParticipant] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>(''); // À récupérer du context user

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await tournamentAPI.getTournament(parseInt(id));
        setTournament(response.data);
        
        // TODO: Récupérer l'ID utilisateur actuel depuis le context
        // setIsParticipant(response.data.participants.some(p => p.id === currentUserId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const handleJoin = async () => {
    if (!tournament) return;

    setIsJoining(true);
    setMessage(null);

    try {
      await tournamentAPI.joinTournament(tournament.id);
      setMessage({ type: 'success', text: 'Vous avez rejoint le tournoi !' });
      
      // Recharger les données
      const response = await tournamentAPI.getTournament(tournament.id);
      setTournament(response.data);
      setIsParticipant(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de l\'inscription' });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!tournament) return;

    setIsLeaving(true);
    setMessage(null);

    try {
      await tournamentAPI.leaveTournament(tournament.id);
      setMessage({ type: 'success', text: 'Vous avez quitté le tournoi' });
      
      // Recharger les données
      const response = await tournamentAPI.getTournament(tournament.id);
      setTournament(response.data);
      setIsParticipant(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du départ' });
    } finally {
      setIsLeaving(false);
    }
  };

  const handleStart = async () => {
    if (!tournament) return;

    try {
      await tournamentAPI.startTournament(tournament.id);
      setMessage({ type: 'success', text: 'Tournoi démarré !' });
      
      // Recharger
      const response = await tournamentAPI.getTournament(tournament.id);
      setTournament(response.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur au démarrage' });
    }
  };

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

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem' }}>⏳</div>
        <p>Chargement du tournoi...</p>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', color: 'var(--danger)' }}>⚠️</div>
        <p style={{ color: 'var(--danger)' }}>{error || 'Tournoi introuvable'}</p>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/tournaments')}
          style={{ marginTop: '1rem' }}
        >
          ← Retour aux tournois
        </button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(tournament.status);
  const progress = (tournament.currentParticipants / tournament.maxParticipants) * 100;
  const isFull = tournament.currentParticipants >= tournament.maxParticipants;
  const canStart = tournament.status === 'pending' && tournament.currentParticipants >= 2;
  const isCreator = tournament.creator.id === currentUserId;

  return (
    <div className="tournament-detail-page">
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 className="page-title">{tournament.name}</h1>
              <p className="page-subtitle">
                Par {tournament.creator.username} • {getTypeName(tournament.type)}
              </p>
            </div>
            <span style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: 'bold',
              background: `${statusBadge.color}20`,
              color: statusBadge.color
            }}>
              {statusBadge.text}
            </span>
          </div>
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

        <div className="grid grid-2">
          {/* Informations */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>📋 Informations</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Description</h3>
              <p style={{ color: 'var(--gray-700)' }}>
                {tournament.description || 'Pas de description'}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Participants</h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{tournament.currentParticipants}/{tournament.maxParticipants} inscrits</span>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: isFull ? 'var(--danger)' : 'var(--success)'
                  }}>
                    {isFull ? '🔴 Complet' : '🟢 Places disponibles'}
                  </span>
                </div>
              </div>
              <div style={{ 
                width: '100%', 
                height: '12px', 
                background: 'var(--gray-200)', 
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${progress}%`, 
                  height: '100%', 
                  background: isFull ? 'var(--danger)' : 'var(--success)',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>

            {tournament.startDate && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Date de début</h3>
                <p style={{ color: 'var(--gray-700)' }}>
                  📅 {new Date(tournament.startDate).toLocaleString('fr-FR')}
                </p>
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Créé le</h3>
              <p style={{ color: 'var(--gray-700)' }}>
                📅 {new Date(tournament.createdAt).toLocaleString('fr-FR')}
              </p>
            </div>

            {/* Actions */}
            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid var(--gray-200)' 
            }}>
              {tournament.status === 'pending' && (
                <>
                  {isParticipant ? (
                    <button
                      className="btn btn-danger"
                      onClick={handleLeave}
                      disabled={isLeaving}
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                    >
                      {isLeaving ? '⏳ Départ...' : '🚪 Quitter le tournoi'}
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={handleJoin}
                      disabled={isJoining || isFull}
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                    >
                      {isJoining ? '⏳ Inscription...' : isFull ? '🔴 Complet' : '✅ Rejoindre'}
                    </button>
                  )}

                  {isCreator && canStart && (
                    <button
                      className="btn btn-primary"
                      onClick={handleStart}
                      style={{ width: '100%' }}
                    >
                      🚀 Démarrer le tournoi
                    </button>
                  )}
                </>
              )}

              {tournament.status === 'in_progress' && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '6px'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚔️</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--success)' }}>
                    Tournoi en cours
                  </div>
                </div>
              )}

              {tournament.status === 'completed' && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  background: 'var(--gray-100)',
                  borderRadius: '6px'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                  <div style={{ fontWeight: 'bold' }}>
                    Tournoi terminé
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>👥 Participants ({tournament.currentParticipants})</h2>
            
            {tournament.participants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😕</div>
                <p>Aucun participant pour le moment</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {tournament.participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: 'var(--gray-100)',
                      borderRadius: '6px'
                    }}
                  >
                    <span style={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.2rem',
                      color: 'var(--gray-500)',
                      minWidth: '30px'
                    }}>
                      #{index + 1}
                    </span>
                    <span style={{ fontSize: '1.5rem' }}>{participant.avatar}</span>
                    <span style={{ fontWeight: 'bold', flex: 1 }}>{participant.username}</span>
                    {participant.id === tournament.creator.id && (
                      <span style={{ 
                        fontSize: '0.85rem',
                        padding: '0.25rem 0.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                      }}>
                        👑 Créateur
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Brackets (si en cours ou terminé) */}
        {(tournament.status === 'in_progress' || tournament.status === 'completed') && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>🎯 Brackets</h2>
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-600)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
              <p>Les brackets seront affichés ici</p>
              <p style={{ fontSize: '0.9rem' }}>
                Fonctionnalité à venir depuis le backend
              </p>
            </div>
          </div>
        )}

        {/* Bouton retour */}
        <div style={{ marginTop: '2rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/tournaments')}
          >
            ← Retour aux tournois
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;