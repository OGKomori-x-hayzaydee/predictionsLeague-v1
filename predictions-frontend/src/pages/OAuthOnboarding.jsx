import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import { Check } from '@phosphor-icons/react';
import Button from '../components/ui/buttons/Button';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const fieldWrap = (err) =>
  `rounded-md border bg-surface-elevated transition-colors ${
    err
      ? 'border-state-error focus-within:border-state-error'
      : 'border-border-control focus-within:border-brand-teal'
  }`;

export default function OAuthOnboarding() {
  const [formData, setFormData] = useState({
    username: '',
    favouriteTeam: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { completeOAuthProfile, authState, oauthData } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = usePrefersReducedMotion();

  const teams = [
    'Arsenal',
    'Chelsea',
    'Liverpool',
    'Manchester City',
    'Manchester United',
    'Tottenham Hotspur',
  ];

  useEffect(() => {
    if (authState === 'authenticated') {
      navigate('/dashboard', { replace: true });
    }
  }, [authState, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.favouriteTeam) {
      newErrors.favouriteTeam = 'Please select your favourite team';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await completeOAuthProfile({
        username: formData.username,
        favouriteTeam: formData.favouriteTeam,
      });
    } catch (error) {
      console.error('OAuth Onboarding - Profile completion error:', error);

      if (error.message.includes('Username already taken')) {
        setErrors({ username: 'Username already taken' });
      } else {
        setErrors({ submit: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signedInEmail = oauthData.email || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('oauth_user_email') : null);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface-app">
      <Container size="2" className="relative z-10 pb-16 pt-32">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md overflow-hidden rounded-lg border border-border-card bg-surface-card p-8 shadow-card"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-dmSerif text-3xl font-bold text-text-primary">
              complete your profile
            </h1>
            <p className="font-outfit text-text-muted">
              welcome! just a couple more details to get started
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 rounded-lg border border-state-error/30 bg-state-error/10 px-4 py-3 font-outfit text-sm text-state-error">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="mb-2 block font-outfit text-sm font-medium text-text-secondary">
                choose a username
              </label>
              <div className={fieldWrap(errors.username)}>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  required
                  className="w-full min-h-11 bg-transparent px-3 py-2 font-outfit text-text-primary outline-none placeholder:text-text-disabled"
                />
              </div>
              {errors.username && (
                <p className="mt-1 font-outfit text-xs text-state-error">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="favouriteTeam" className="mb-2 block font-outfit text-sm font-medium text-text-secondary">
                favourite premier league team
              </label>
              <div className={fieldWrap(errors.favouriteTeam)}>
                <select
                  id="favouriteTeam"
                  name="favouriteTeam"
                  value={formData.favouriteTeam}
                  onChange={handleChange}
                  required
                  className="w-full min-h-11 cursor-pointer bg-transparent px-3 py-2 font-outfit text-text-primary outline-none"
                >
                  <option value="" className="bg-surface-card text-text-primary">
                    select your team
                  </option>
                  {teams.map((team) => (
                    <option key={team} value={team} className="bg-surface-card text-text-primary">
                      {team}
                    </option>
                  ))}
                </select>
              </div>
              {errors.favouriteTeam && (
                <p className="mt-1 font-outfit text-xs text-state-error">{errors.favouriteTeam}</p>
              )}
            </div>

            <Button type="submit" loading={isLoading} className="w-full">
              {isLoading ? 'completing profile...' : 'complete profile'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="flex items-center justify-center gap-1.5 font-outfit text-sm text-text-muted">
              your google account is already verified <Check className="inline h-3.5 w-3.5" />
            </p>
            {signedInEmail && (
              <p className="mt-1 font-outfit text-xs text-text-muted">
                signed in as: {signedInEmail}
              </p>
            )}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
