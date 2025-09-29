// frontend_B/src/pages/Game.tsx - VERSION PROPRE PRÊTE BACKEND

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gameAPI } from '../services/api';

interface GameData {
  id: string;
  players: Array<{
    id: string;
    username: string;
    avatar: string;
  }>;
  score: {
    player1: number;
    player2: number;
  };
  status: 'waiting' | 'playing' | 'finished';
  spectatorCount: number;
}

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) return;

      try {
        setIsLoading(true);
        const response = await gameAPI.getGame(gameId);
        setGameData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();

    // TODO: Setup WebSocket pour updates en temps réel
    // const ws = new WebSocket(`ws://localhost:3002/game/${gameId}`);
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   setGameData(data.gameState);
    // };
    // return () => ws.close();
  }, [gameId]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // TODO: Envoyer via WebSocket
    setMessages(prev => [...prev, {
      username: 'Moi',
      message: chatMessage,
      timestamp: new Date()
    }]);
    setChatMessage('');
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem' }}>⏳</div>
        <p>Chargement de la partie...</p>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', color: 'var(--danger)' }}>⚠️</div>
        <p style={{ color: 'var(--danger)' }}>{error || 'Partie introuvable'}</p>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="page-title" style={{ fontSize: '1.5rem', margin: 0 }}>
              🏓 Partie Pong
            </h1>
            
            <div className="game-score" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              background: 'var(--white)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              boxShadow: 'var(--shadow)'
            }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{gameData.players[0]?.username || 'Joueur 1'}</div>
                <div style={{ fontSize: '2rem', textAlign: 'center' }}>{gameData.score.player1}</div>
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--gray-500)' }}>VS</div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{gameData.players[1]?.username || 'Joueur 2'}</div>
                <div style={{ fontSize: '2rem', textAlign: 'center' }}>{gameData.score.player2}</div>
              </div>
            </div>

            <div className="game-actions" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary">⚙️</button>
              <button className="btn btn-danger">🚪 Quitter</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '1.5rem',
          minHeight: '600px'
        }}>
          
          <div className="card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a1a1a'
          }}>
            <div id="game-canvas-container" style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '3rem' }}>🎮</div>
              <div style={{ fontSize: '1.2rem' }}>Zone du moteur de jeu (Game_D)</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Canvas WebGL sera injecté ici
              </div>
            </div>
          </div>

          <div className="game-sidebar">
            <div className="card mb-4">
              <h3 style={{ marginBottom: '1rem' }}>👥 Joueurs</h3>
              {gameData.players.map((player, index) => (
                <div key={player.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  background: 'var(--gray-100)',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{player.avatar || '😀'}</span>
                  <span style={{ fontWeight: 'bold' }}>{player.username}</span>
                </div>
              ))}
            </div>

            <div className="card mb-4">
              <h3 style={{ marginBottom: '1rem' }}>
                👀 Spectateurs ({gameData.spectatorCount})
              </h3>
            </div>

            <div className="card" style={{ 
              height: '300px', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <h3 style={{ marginBottom: '1rem' }}>💬 Chat</h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto',
                border: '1px solid var(--gray-300)',
                borderRadius: '6px',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                background: 'var(--gray-50)'
              }}>
                {messages.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    color: 'var(--gray-500)', 
                    fontSize: '0.9rem' 
                  }}>
                    Aucun message
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--primary)' }}>{msg.username}:</strong>{' '}
                      <span style={{ fontSize: '0.9rem' }}>{msg.message}</span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{ fontSize: '0.9rem' }}
                />
                <button 
                  className="btn btn-primary"
                  onClick={handleSendMessage}
                  style={{ padding: '0.5rem' }}
                >
                  📤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;