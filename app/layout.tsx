import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ClientProviders } from '@/components/ClientProviders';

export const metadata: Metadata = { metadataBase: new URL('https://ekayn.com'), title: { default: 'Ekayn — Bijoux d’inspiration traditionnelle', template: '%s — Ekayn' }, description: 'Découvrez Ekayn, une sélection de bijoux élégants d’inspiration traditionnelle.', icons: { icon: '/assets/icon.png' }, openGraph: { siteName: 'Ekayn', type: 'website' } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body><div className="announcement"><span className="announcement-desktop">BIJOUX D’INSPIRATION traditionnelle · UN HÉRITAGE À PORTER</span><span className="announcement-mobile">INSPIRATION traditionnelle · UN HÉRITAGE À PORTER</span></div><ClientProviders><Header />{children}<Footer /></ClientProviders></body></html>; }
