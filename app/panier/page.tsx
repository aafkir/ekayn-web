'use client';
import { useRouter } from 'next/navigation';
import { CartDrawer } from '@/components/store/CartDrawer';
export default function CartPage() { const router = useRouter(); return <main className="page-wrap"><p className="eyebrow">VOTRE SÉLECTION</p><h1>Mon <em>panier.</em></h1><CartDrawer open onClose={() => router.push('/')} /></main>; }
