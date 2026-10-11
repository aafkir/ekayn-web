'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getMe } from '@/lib/api/endpoints';
export function SessionGuard({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) { const router = useRouter(); const pathname = usePathname(); const [ready, setReady] = useState(false); useEffect(() => { getMe().then((profile) => { if (admin && profile.role !== 'ADMIN') throw new Error('forbidden'); setReady(true); }).catch(() => router.replace(`/connexion?returnTo=${encodeURIComponent(`${pathname}${window.location.search}`)}`)); }, [admin, pathname, router]); if (!ready) return <main className="page-wrap"><p className="loading">Chargement de votre espace…</p></main>; return <>{children}</>; }
