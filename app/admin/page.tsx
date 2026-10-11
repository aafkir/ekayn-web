import { SessionGuard } from '@/components/auth/SessionGuard';
import { AdminOrdersView } from '@/components/admin/AdminOrdersView';
export const metadata = { title: 'Administration' };
export default function AdminPage() { return <SessionGuard admin><main className="dashboard"><p className="eyebrow">ADMINISTRATION</p><h1>Suivi des <em>commandes.</em></h1><AdminOrdersView /></main></SessionGuard>; }
