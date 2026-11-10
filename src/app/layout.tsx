import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'The Shared Space', description: 'A private space for routines, agreements and wellbeing', manifest: '/manifest.json', themeColor: '#211a2d' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
