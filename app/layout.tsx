import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.tsx';
import { Providers } from './providers';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'CUKIMAI - World Financial Galaxy',
  description: 'Financial galaxy with 3D interactive assets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
