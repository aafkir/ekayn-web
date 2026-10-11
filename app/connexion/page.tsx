import Link from 'next/link';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
export const metadata = { title: 'Connexion' };
export default function LoginPage() { return <main className="account-page"><p className="eyebrow">ESPACE CLIENT</p><h1>Bonjour <em>à nouveau.</em></h1><Suspense fallback={<p className="loading">Chargement…</p>}><AuthForm mode="login" /></Suspense><p className="account-switch"><Link href="/mot-de-passe-oublie">Mot de passe oublié ?</Link></p><p className="account-switch">Pas encore de compte ? <Link href="/inscription">Créer un compte</Link></p></main>; }
