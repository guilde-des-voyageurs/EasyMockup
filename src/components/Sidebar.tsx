'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  // Utilise usePathname pour savoir quelle page est active
  const pathname = usePathname();

  // Définition de nos liens avec leurs propriétés
  const links = [
    {
      href: '/',
      label: 'Génération',
      icon: '⚡'
    },
    {
      href: '/modeles',
      label: 'Modèles',
      icon: '🎨'
    },
    {
      href: '/fichiers',
      label: 'Fichiers',
      icon: '📁'
    }
  ];

  return (
    <nav className="w-64 h-screen bg-gray-50 border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">EasyMockup</h1>
      </div>
      
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link 
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors
                ${pathname === link.href 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}