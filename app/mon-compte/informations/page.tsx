import { SessionGuard } from '@/components/auth/SessionGuard';
import { AccountNavigation } from '@/components/account/AccountNavigation';
import { AccountInfoView } from '@/components/account/AccountInfoView';
export const metadata = { title: 'Mes informations' };
export default function InformationPage() { return <SessionGuard><main className="account-shell"><div className="account-heading"><p className="eyebrow">ESPACE CLIENT</p><h1>Mon compte</h1></div><div className="account-layout"><AccountNavigation /><section className="account-content"><h2>Mes informations</h2><AccountInfoView /></section></div></main></SessionGuard>; }
