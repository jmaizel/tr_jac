// frontend_B/src/pages/CreateTournament.tsx - VERSION PROPRE PRÊTE BACKEND

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentAPI } from '../services/api';

interface TournamentForm {
  name: string;
  description: string;
  type: 'single_elimination' | 'double_elimination' | 'round_robin';
  maxParticipants: number;
  startDate?: string;
}

const CreateTournament: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TournamentForm>({
    name: '',
    description: '',
    type: 'single_elimination',
    maxParticipants: 8,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tournamentTypes = [
    { 
      value: 'single_elimination', 
      label: '🏆 Élimination simple', 
      description: 'Un seul match perdu = éliminé' 
    },
    { 
      value: 'double_elimination', 
      label: '🏆🏆 Élimination double', 
      description: 'Deux chances, plus équitable' 
    },
    { 
      value: 'round_robin', 
      label: '🔄 Round Robin', 
      description: 'Tout le monde joue contre tout le monde' 
    },
  ];

  const participantOptions = [4, 8, 16, 32, 64];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du tournoi est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit faire au moins 3 caractères';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Le nom ne peut pas dépasser 50 caractères';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'La description ne peut pas dépasser 200 caractères';
    }

    if (formData.maxParticipants < 2) {
      newErrors.maxParticipants = 'Il faut au moins 2 participants';
    } else if (formData.maxParticipants > 64) {
      newErrors.maxParticipants = 'Maximum 64 participants';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await tournamentAPI.createTournament(formData);
      navigate(`/tournaments/${response.data.id}`);
    } catch (err: any) {
      setErrors({ 
        submit: err.response?.data?.message || 'Erreur lors de la création du tournoi' 
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-tournament-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">➕ Créer un tournoi</h1>
          <p className="page-subtitle">Organisez votre propre compétition</p>
        </div>
      </div>

      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="card">
              <h2 style={{ marginBottom: '2rem' }}>📋 Informations du tournoi</h2>

              {errors.submit && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--danger)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  {errors.submit}
                </div>
              )}

              {/* Nom du tournoi */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nom du tournoi *
                </label>
                <input
                  id="name"
                  className="input"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Tournoi d'été 2025"
                  maxLength={50}
                />
                {errors.name && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>
                    {errors.name}
                  </span>
                )}
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--gray-600)', 
                  marginTop: '0.25rem',
                  textAlign: 'right' 
                }}>
                  {formData.name.length}/50
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description (optionnel)
                </label>
                <textarea
                  id="description"
                  className="input"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Décrivez votre tournoi..."
                  rows={4}
                  maxLength={200}
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
                {errors.description && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>
                    {errors.description}
                  </span>
                )}
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--gray-600)', 
                  marginTop: '0.25rem',
                  textAlign: 'right' 
                }}>
                  {formData.description.length}/200
                </div>
              </div>

              {/* Type de tournoi */}
              <div className="form-group">
                <label className="form-label">Type de tournoi *</label>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {tournamentTypes.map(type => (
                    <label
                      key={type.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        border: formData.type === type.value 
                          ? '2px solid var(--primary)' 
                          : '2px solid var(--gray-300)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: formData.type === type.value 
                          ? 'rgba(102, 126, 234, 0.05)' 
                          : 'white'
                      }}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => handleChange('type', e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {type.label}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                          {type.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nombre de participants */}
              <div className="form-group">
                <label htmlFor="maxParticipants" className="form-label">
                  Nombre maximum de participants *
                </label>
                <select
                  id="maxParticipants"
                  className="input"
                  value={formData.maxParticipants}
                  onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value))}
                >
                  {participantOptions.map(num => (
                    <option key={num} value={num}>
                      {num} joueurs
                    </option>
                  ))}
                </select>
                {errors.maxParticipants && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>
                    {errors.maxParticipants}
                  </span>
                )}
              </div>

              {/* Date de début (optionnel) */}
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Date de début (optionnel)
                </label>
                <input
                  id="startDate"
                  type="datetime-local"
                  className="input"
                  value={formData.startDate || ''}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                  Si non spécifiée, le tournoi démarrera dès qu'il sera complet
                </div>
              </div>

              {/* Récapitulatif */}
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'var(--gray-100)',
                borderRadius: '8px'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>📋 Récapitulatif</h3>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div>
                    <strong>Nom :</strong> {formData.name || <em style={{ color: 'var(--gray-500)' }}>Non défini</em>}
                  </div>
                  <div>
                    <strong>Type :</strong> {tournamentTypes.find(t => t.value === formData.type)?.label}
                  </div>
                  <div>
                    <strong>Participants :</strong> {formData.maxParticipants} maximum
                  </div>
                  {formData.startDate && (
                    <div>
                      <strong>Début :</strong> {new Date(formData.startDate).toLocaleString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/tournaments')}
                  disabled={isSubmitting}
                >
                  ❌ Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '⏳ Création...' : '✅ Créer le tournoi'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTournament;