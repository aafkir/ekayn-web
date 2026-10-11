import Link from 'next/link';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
export const metadata = { title: 'Mot de passe oublié' };
export default function ForgotPage() { return <main className="account-page"><p className="eyebrow">ESPACE CLIENT</p><h1>Un nouveau <em>départ.</em></h1><p className="page-lead">Saisissez votre email. Si le compte existe, nous vous enverrons un lien.</p><Suspense fallback={<p className="loading">Chargement…</p>}><AuthForm mode="forgot" /></Suspense><p className="account-switch"><Link href="/connexion">Retour à la connexion</Link></p></main>; }
