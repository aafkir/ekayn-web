'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { forgotPassword, login, register, resetPassword, verifyEmail } from '@/lib/api/endpoints';

type Mode = 'login' | 'register' | 'forgot' | 'reset' | 'verify';

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
    if ((mode === 'register' && values.password !== values.confirmation) || (mode === 'reset' && values.newPassword !== values.confirmation)) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(values.email, values.password);
        window.dispatchEvent(new Event('ekayn-auth-changed'));
        const destination = params.get('returnTo');
        router.push(destination?.startsWith('/') && !destination.startsWith('//') ? destination : '/mon-compte/commandes');
        return;
      }
      if (mode === 'register') {
        await register({ email: values.email, password: values.password, firstName: values.firstName, lastName: values.lastName });
        setMessage('Votre compte a été créé. Vérifiez votre adresse email pour pouvoir passer commande.');
      }
      if (mode === 'forgot') {
        await forgotPassword(values.email);
        setMessage('Si cette adresse existe, un lien de réinitialisation a été envoyé.');
      }
      if (mode === 'reset') {
        await resetPassword({ email: values.email, token: values.token, newPassword: values.newPassword });
        setMessage('Mot de passe mis à jour. Vous pouvez vous connecter.');
        setTimeout(() => router.push('/connexion'), 900);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  if (mode === 'verify') return <VerifyForm />;
  const reset = mode === 'reset';
  return <form className="account-form" onSubmit={submit}>
    {mode === 'register' && <><label>Prénom<input name="firstName" autoComplete="given-name" required /></label><label>Nom<input name="lastName" autoComplete="family-name" required /></label></>}
    <label>Email<input type="email" name="email" defaultValue={reset ? params.get('email') ?? '' : ''} autoComplete="email" required /></label>
    {mode !== 'forgot' && <label>{reset ? 'Nouveau mot de passe' : 'Mot de passe'}<input type="password" name={reset ? 'newPassword' : 'password'} minLength={8} autoComplete={reset || mode === 'register' ? 'new-password' : 'current-password'} required /></label>}
    {mode === 'register' && <><small>8 caractères minimum.</small><label>Confirmation du mot de passe<input type="password" name="confirmation" minLength={8} autoComplete="new-password" required /></label></>}
    {reset && <><input type="hidden" name="token" value={params.get('token') ?? ''} /><label>Confirmation du nouveau mot de passe<input type="password" name="confirmation" minLength={8} autoComplete="new-password" required /></label></>}
    <button className="primary" type="submit" disabled={loading}>{loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : mode === 'register' ? 'Créer mon compte' : mode === 'forgot' ? 'Recevoir le lien' : 'Enregistrer'}</button>
    {message && <p className="form-message success" role="status">{message}</p>}
    {error && <p className="form-message error" role="alert">{error}</p>}
  </form>;
}

function VerifyForm() {
  const params = useSearchParams();
  const [state, setState] = useState('Vérification en cours…');
  const [error, setError] = useState(false);
  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setState('Lien de vérification incomplet.');
      setError(true);
    } else {
      verifyEmail(token)
        .then(() => setState('Votre adresse email est vérifiée. Vous pouvez maintenant vous connecter et passer commande.'))
        .catch((e) => { setState(e instanceof Error ? e.message : 'Lien invalide ou expiré.'); setError(true); });
    }
  }, [params]);
  return <p className={`form-message ${error ? 'error' : 'success'}`} role="status">{state}</p>;
}
