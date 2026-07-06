'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Forex', href: '/forex' },
  { name: 'Crypto', href: '/crypto' },
  { name: 'Gold', href: '/gold' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-8 h-[72px] flex items-center justify-between',
      scrolled
        ? 'bg-[#0b0d1a]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl'
        : 'bg-transparent backdrop-blur-sm'
    )}>
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold/20 group-hover:scale-105 transition-transform">
          <span className="text-[#0b0d1a] text-xl font-bold">C</span>
        </div>
        <span className="text-2xl font-bold text-gold tracking-tight">CUKIMAI</span>
      </Link>

      <ul className="flex items-center gap-8 md:gap-12">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-all duration-300 relative py-1 tracking-wide',
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-gold-400 to-gold-600 rounded-full" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
