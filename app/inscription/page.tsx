import Link from 'next/link';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
export const metadata = { title: 'Créer un compte' };
export default function RegisterPage() { return <main className="account-page"><p className="eyebrow">ESPACE CLIENT</p><h1>Créer votre <em>compte.</em></h1><p className="page-lead">Retrouvez vos commandes et suivez vos livraisons.</p><Suspense fallback={<p className="loading">Chargement…</p>}><AuthForm mode="register" /></Suspense><p className="account-switch">Déjà un compte ? <Link href="/connexion">Se connecter</Link></p></main>; }
