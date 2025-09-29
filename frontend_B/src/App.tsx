// frontend_B/src/App.tsx - AVEC TOUTES LES ROUTES

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TournamentProvider } from './contexts/TournamentContext';
import { UserProvider } from './contexts/UserContext';
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import CreateTournament from './pages/CreateTournament';
import TournamentDetail from './pages/TournamentDetail';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Game from './pages/Game';
import Login from './pages/Login';
import Settings from './pages/Settings';
import History from './pages/History';

import './App.css';

function App() {
  return (
    <UserProvider>
      <TournamentProvider>
        <Router>
          <div className="app">
            <Navigation />
            <main className="main-content">
              <Routes>
                {/* Pages publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Tournois */}
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/tournaments/:id" element={<TournamentDetail />} />
                <Route path="/create-tournament" element={<CreateTournament />} />
                
                {/* Jeu */}
                <Route path="/game/:gameId" element={<Game />} />
                
                {/* Utilisateur */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/history" element={<History />} />
                
                {/* Classement */}
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TournamentProvider>
    </UserProvider>
  );
}

export default App;