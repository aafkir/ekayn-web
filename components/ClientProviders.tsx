'use client';
import { CartProvider } from './store/cart-context';
import { CartConfirmationDrawer } from './store/CartConfirmationDrawer';
export function ClientProviders({ children }: { children: React.ReactNode }) { return <CartProvider>{children}<CartConfirmationDrawer /></CartProvider>; }
