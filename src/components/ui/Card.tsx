import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-xl p-4 border border-gray-700 ${
        onClick ? 'cursor-pointer hover:scale-[1.02] transition-all' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
