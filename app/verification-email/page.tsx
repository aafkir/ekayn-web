import Link from 'next/link';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
export const metadata = { title: 'Vérification email' };
export default function VerifyPage() { return <main className="account-page verify-page"><p className="eyebrow">ESPACE CLIENT</p><h1>Vérification de votre <em>email.</em></h1><Suspense fallback={<p className="loading">Vérification en cours…</p>}><AuthForm mode="verify" /></Suspense><Link className="primary" href="/connexion">Se connecter</Link></main>; }
