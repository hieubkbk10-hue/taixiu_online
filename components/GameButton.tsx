import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GameButtonProps {
  icon: LucideIcon;
  color?: 'blue' | 'red' | 'gray';
  onClick?: () => void;
  className?: string;
  badge?: string;
}

const GameButton: React.FC<GameButtonProps> = ({ icon: Icon, color = 'blue', onClick, className = '', badge }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-b from-sky-500 to-blue-700 border-blue-400',
    red: 'bg-gradient-to-b from-red-500 to-red-700 border-red-400',
    gray: 'bg-gradient-to-b from-gray-500 to-gray-700 border-gray-400',
  };

  return (
    <button
      onClick={onClick}
      className={`relative w-7 h-7 md:w-9 md:h-9 rounded-full border-2 shadow-[0_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center active:scale-95 transition-transform ${colorClasses[color]} ${className}`}
    >
      <Icon className="text-white drop-shadow-md w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-bold px-1 py-0.5 rounded-full border border-white">
          {badge}
        </span>
      )}
    </button>
  );
};

export default GameButton;
