// frontend_B/src/pages/Game.tsx - PAGE GAME POUR GAME_D

import React, { useState, useEffect } from 'react';

// Interface pour les informations de partie
interface GameInfo {
  gameId: string;
  players: Player[];
  spectators: number;
  gameMode: 'classic' | 'speed' | 'tournament';
  status: 'waiting' | 'playing' | 'finished';
  score: {
    player1: number;
    player2: number;
  };
}

interface Player {
  id: string;
  username: string;
  avatar: string;
  isReady: boolean;
}

const Game: React.FC = () => {
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isSpectating, setIsSpectating] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Simulation de données (à connecter au backend plus tard)
  useEffect(() => {
    // Simulation d'une partie
    setGameInfo({
      gameId: 'game-123',
      players: [
        { id: '1', username: 'Player1', avatar: '🎮', isReady: true },
        { id: '2', username: 'Player2', avatar: '🕹️', isReady: true }
      ],
      spectators: 5,
      gameMode: 'classic',
      status: 'playing',
      score: { player1: 3, player2: 2 }
    });
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      username: 'Moi',
      message: newMessage,
      timestamp: new Date()
    }]);
    setNewMessage('');
  };

  return (
    <div className="game-page">
      {/* Header de la partie */}
      <div className="game-header">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="game-info">
              <h1 className="page-title" style={{ fontSize: '1.5rem', margin: 0 }}>
                🏓 Partie Pong
              </h1>
              <div className="game-meta" style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                Mode: {gameInfo?.gameMode} • {gameInfo?.spectators} spectateurs
              </div>
            </div>
            
            {/* Score */}
            {gameInfo && (
              <div className="game-score" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                background: 'var(--white)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                boxShadow: 'var(--shadow)'
              }}>
                <div className="player-score">
                  <div style={{ fontWeight: 'bold' }}>{gameInfo.players[0]?.username}</div>
                  <div style={{ fontSize: '2rem', textAlign: 'center' }}>{gameInfo.score.player1}</div>
                </div>
                <div style={{ fontSize: '1.5rem', color: 'var(--gray-500)' }}>VS</div>
                <div className="player-score">
                  <div style={{ fontWeight: 'bold' }}>{gameInfo.players[1]?.username}</div>
                  <div style={{ fontSize: '2rem', textAlign: 'center' }}>{gameInfo.score.player2}</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="game-actions" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary">
                ⚙️ Options
              </button>
              <button className="btn btn-danger">
                🚪 Quitter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="game-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '1.5rem',
          height: 'calc(100vh - 200px)'
        }}>
          
          {/* Zone de jeu principale - ICI QUE GAME_D INJECTE SON MOTEUR */}
          <div className="game-area card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px',
            background: '#1a1a1a'
          }}>
            {/* PLACEHOLDER - Game_D remplacera ce div par son canvas */}
            <div id="game-engine-container" style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              🎮 Zone réservée au moteur de jeu (Game_D)
              <br />
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Canvas WebGL/2D sera injecté ici
              </span>
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="game-sidebar">
            
            {/* Informations des joueurs */}
            <div className="card mb-4">
              <h3 style={{ marginBottom: '1rem' }}>👥 Joueurs</h3>
              {gameInfo?.players.map(player => (
                <div key={player.id} className="player-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  background: 'var(--gray-100)',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{player.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{player.username}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                      {player.isReady ? '✅ Prêt' : '⏳ En attente'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Spectateurs */}
            <div className="card mb-4">
              <h3 style={{ marginBottom: '1rem' }}>👀 Spectateurs ({gameInfo?.spectators || 0})</h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                Les spectateurs peuvent regarder et discuter
              </div>
            </div>

            {/* Chat en temps réel */}
            <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '1rem' }}>💬 Chat</h3>
              
              {/* Messages */}
              <div className="chat-messages" style={{
                flex: 1,
                overflowY: 'auto',
                border: '1px solid var(--gray-300)',
                borderRadius: '6px',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                background: 'var(--gray-50)'
              }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                    Aucun message
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--primary)' }}>{msg.username}:</strong>{' '}
                      <span style={{ fontSize: '0.9rem' }}>{msg.message}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Input chat */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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