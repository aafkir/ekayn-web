'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/api/endpoints';

export function AccountNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    try { await logout(); }
    finally {
      window.dispatchEvent(new Event('ekayn-auth-changed'));
      router.push('/');
      router.refresh();
    }
  }
  return <>
    <div className="account-mobile-tabs"><Link className={pathname.includes('/commandes') ? 'active' : ''} href="/mon-compte/commandes">Mes commandes</Link><Link className={pathname.includes('/informations') ? 'active' : ''} href="/mon-compte/informations">Mes informations</Link></div>
    <nav className="account-side-nav" aria-label="Navigation du compte"><Link className={pathname.includes('/commandes') ? 'active' : ''} href="/mon-compte/commandes">Mes commandes</Link><Link className={pathname.includes('/informations') ? 'active' : ''} href="/mon-compte/informations">Mes informations</Link><button type="button" onClick={signOut}>Se déconnecter</button></nav>
  </>;
}
