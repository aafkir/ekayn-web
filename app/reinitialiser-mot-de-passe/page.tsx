import { AuthForm } from '@/components/auth/AuthForm';
import { Suspense } from 'react';
export const metadata = { title: 'Réinitialiser le mot de passe' };
export default function ResetPage() { return <main className="account-page"><p className="eyebrow">ESPACE CLIENT</p><h1>Nouveau <em>mot de passe.</em></h1><Suspense fallback={<p className="loading">Chargement…</p>}><AuthForm mode="reset" /></Suspense></main>; }
