'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const navItems = [
    { href: '/chat', label: 'Chat' },
    { href: '/conversations', label: 'Dashboard' },
    { href: '/intelligence', label: 'Intelligence' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* One-line flex container */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand */}
          <Link
            href="/chat"
            className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white whitespace-nowrap"
          >
           AI
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 flex-shrink">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base md:text-[1rem] font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}