// frontend_B/src/pages/Game.tsx - PAGE DÉDIÉE AUX JEUX

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const Game: React.FC = () => {
  const { user, simulateGameWin, simulateGameLoss } = useUser();
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer' | 'tournament'>('single');
  const [selectedGame, setSelectedGame] = useState<string>('pong');
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);

  // Placeholder pour le jeu de votre ami
  const startGame = () => {
    console.log('🎮 Démarrage du jeu:', selectedGame, 'mode:', gameMode);
    setIsGameActive(true);
    
    // TODO: Ici, votre ami peut intégrer son code de jeu
    // Exemple d'intégration :
    // import { PongGame } from '../games/pong';
    // const game = new PongGame(gameCanvasRef.current);
    // game.start();
  };

  const stopGame = () => {
    console.log('⏹️ Arrêt du jeu');
    setIsGameActive(false);
    
    // TODO: Nettoyer les ressources du jeu
  };

  // Simulation de fin de partie (pour tester)
  const simulateGameEnd = (won: boolean) => {
    stopGame();
    if (won) {
      simulateGameWin();
    } else {
      simulateGameLoss();
    }
  };

  useEffect(() => {
    // Cleanup à la fermeture du composant
    return () => {
      if (isGameActive) {
        stopGame();
      }
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <section className="page-header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            🎮 Zone de Jeu
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.1rem', opacity: '0.9' }}>
            Affrontez vos amis dans des parties épiques de Pong !
          </p>
          {user && (
            <div style={{ marginTop: '1rem', fontSize: '0.95rem', opacity: '0.8' }}>
              Connecté en tant que <strong>{user.username}</strong> • 
              Score: <strong>{user.totalScore} pts</strong> • 
              Ratio: <strong>{user.winRate.toFixed(1)}%</strong>
            </div>
          )}
        </div>
      </section>

      {/* Configuration du jeu */}
      <section style={{ padding: '3rem 0', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
          
          {!isGameActive ? (
            <>
              {/* Sélection du jeu */}
              <div className="game-selector" style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
                  🎯 Choisissez votre jeu
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {/* Pong Classique */}
                  <div 
                    onClick={() => setSelectedGame('pong')}
                    style={{
                      padding: '1.5rem',
                      border: selectedGame === 'pong' ? '2px solid #667eea' : '2px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: selectedGame === 'pong' ? 'rgba(102, 126, 234, 0.05)' : 'white'
                    }}
                  >
                    <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>🏓</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', textAlign: 'center', marginBottom: '0.5rem', color: '#2d3748' }}>
                      Pong Classique
                    </h3>
                    <p style={{ color: '#718096', textAlign: 'center', fontSize: '0.9rem' }}>
                      Le jeu original revisité avec des graphismes modernes
                    </p>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', background: '#667eea', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        2 Joueurs
                      </span>
                      <span style={{ fontSize: '0.8rem', background: '#48bb78', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        Temps réel
                      </span>
                    </div>
                  </div>

                  {/* Pong Amélioré (placeholder pour futur) */}
                  <div style={{
                    padding: '1.5rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    opacity: 0.6
                  }}>
                    <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>🚀</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', textAlign: 'center', marginBottom: '0.5rem', color: '#2d3748' }}>
                      Pong Pro
                    </h3>
                    <p style={{ color: '#718096', textAlign: 'center', fontSize: '0.9rem' }}>
                      Version avancée avec power-ups et effets spéciaux
                    </p>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.8rem', background: '#ed8936', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        Bientôt disponible
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode de jeu */}
              <div className="game-modes" style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
                  ⚔️ Mode de jeu
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <button
                    onClick={() => setGameMode('single')}
                    style={{
                      padding: '1rem',
                      border: gameMode === 'single' ? '2px solid #667eea' : '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: gameMode === 'single' ? 'rgba(102, 126, 234, 0.05)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>vs IA</div>
                    <div style={{ fontSize: '0.85rem', color: '#718096' }}>Entraînez-vous contre l'ordinateur</div>
                  </button>

                  <button
                    onClick={() => setGameMode('multiplayer')}
                    style={{
                      padding: '1rem',
                      border: gameMode === 'multiplayer' ? '2px solid #667eea' : '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: gameMode === 'multiplayer' ? 'rgba(102, 126, 234, 0.05)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Multijoueur</div>
                    <div style={{ fontSize: '0.85rem', color: '#718096' }}>Défiez un autre joueur en ligne</div>
                  </button>

                  <button
                    onClick={() => setGameMode('tournament')}
                    style={{
                      padding: '1rem',
                      border: gameMode === 'tournament' ? '2px solid #667eea' : '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: gameMode === 'tournament' ? 'rgba(102, 126, 234, 0.05)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Tournoi</div>
                    <div style={{ fontSize: '0.85rem', color: '#718096' }}>Participez à un tournoi en cours</div>
                  </button>
                </div>
              </div>

              {/* Bouton de démarrage */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={startGame}
                  disabled={!user}
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    background: user ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : '#e2e8f0',
                    color: user ? 'white' : '#a0aec0',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: user ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    boxShadow: user ? '0 4px 15px rgba(72, 187, 120, 0.4)' : 'none'
                  }}
                >
                  🚀 {!user ? 'Connectez-vous pour jouer' : `Lancer ${selectedGame} en mode ${gameMode}`}
                </button>
                
                {!user && (
                  <p style={{ marginTop: '1rem', color: '#718096', fontSize: '0.9rem' }}>
                    Vous devez être connecté pour accéder aux jeux
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Interface de jeu active */
            <div className="game-interface">
              {/* Zone de jeu */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>
                    🎮 {selectedGame.toUpperCase()} - Mode: {gameMode}
                  </div>
                  <button
                    onClick={stopGame}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    🛑 Arrêter
                  </button>
                </div>

                {/* Canvas de jeu */}
                <div style={{
                  border: '2px solid #2d3748',
                  borderRadius: '8px',
                  margin: '0 auto',
                  background: '#000',
                  position: 'relative',
                  width: 'fit-content'
                }}>
                  <canvas
                    ref={gameCanvasRef}
                    width={800}
                    height={400}
                    style={{
                      display: 'block',
                      borderRadius: '6px'
                    }}
                  />
                  
                  {/* Overlay d'instructions temporaire */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textAlign: 'center',
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '2rem',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
                    <h3 style={{ marginBottom: '1rem' }}>Zone de jeu prête !</h3>
                    <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
                      Votre ami peut intégrer son code de Pong ici
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => simulateGameEnd(true)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#48bb78',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        🏆 Simuler Victoire
                      </button>
                      <button
                        onClick={() => simulateGameEnd(false)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        😞 Simuler Défaite
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions de contrôles */}
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#718096' }}>
                  <strong>Contrôles:</strong> ↑↓ ou W/S pour le joueur 1, ↑↓ pour le joueur 2
                </div>
              </div>

              {/* Stats en cours de partie */}
              {user && (
                <div style={{
                  background: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>{user.totalScore}</div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>Score total</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#48bb78' }}>{user.gamesWon}</div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>Victoires</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ed8936' }}>{user.winRate.toFixed(1)}%</div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>Ratio</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9f7aea' }}>{user.totalGames}</div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>Parties</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Section d'aide pour l'intégration */}
      <section style={{ padding: '2rem 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            background: '#f0fff4',
            border: '1px solid #9ae6b4',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#276749', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👨‍💻</span> Guide d'intégration pour votre ami développeur
            </h3>
            <div style={{ color: '#22543d', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <p><strong>📂 Structure recommandée :</strong></p>
              <ul style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                <li><code>frontend_B/src/games/</code> - Dossier pour les jeux</li>
                <li><code>frontend_B/src/games/pong/</code> - Code du Pong</li>
                <li><code>frontend_B/src/games/pong/PongGame.ts</code> - Classe principale</li>
              </ul>
              
              <p><strong>🔌 Points d'intégration :</strong></p>
              <ul style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                <li><strong>Canvas :</strong> <code>gameCanvasRef.current</code> pour le rendu</li>
                <li><strong>Callbacks :</strong> <code>simulateGameWin()</code> / <code>simulateGameLoss()</code> pour les stats</li>
                <li><strong>User data :</strong> Accès au profil utilisateur via <code>user</code></li>
              </ul>
              
              <p><strong>💡 Exemple d'intégration :</strong></p>
              <pre style={{ background: 'rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{`import { PongGame } from '../games/pong/PongGame';

const game = new PongGame({
  canvas: gameCanvasRef.current,
  onGameEnd: (won) => won ? simulateGameWin() : simulateGameLoss(),
  playerName: user.username
});`}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Game;