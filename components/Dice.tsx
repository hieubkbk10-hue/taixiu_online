import React from 'react';
import { DiceValue } from '../types';

interface DiceProps {
  value: DiceValue;
  className?: string;
}

const Dice: React.FC<DiceProps> = ({ value, className = '' }) => {
  // Config for dot positions - smaller dots using percentage-based sizing
  const dotClass = "w-[18%] h-[18%] bg-white rounded-full shadow-inner absolute";
  
  const getDots = () => {
    switch (value) {
      case 1:
        return <div className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>;
      case 2:
        return (
          <>
            <div className={`${dotClass} top-[18%] left-[18%]`}></div>
            <div className={`${dotClass} bottom-[18%] right-[18%]`}></div>
          </>
        );
      case 3:
        return (
          <>
            <div className={`${dotClass} top-[18%] left-[18%]`}></div>
            <div className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>
            <div className={`${dotClass} bottom-[18%] right-[18%]`}></div>
          </>
        );
      case 4:
        return (
          <>
            <div className={`${dotClass} top-[18%] left-[18%]`}></div>
            <div className={`${dotClass} top-[18%] right-[18%]`}></div>
            <div className={`${dotClass} bottom-[18%] left-[18%]`}></div>
            <div className={`${dotClass} bottom-[18%] right-[18%]`}></div>
          </>
        );
      case 5:
        return (
          <>
            <div className={`${dotClass} top-[18%] left-[18%]`}></div>
            <div className={`${dotClass} top-[18%] right-[18%]`}></div>
            <div className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>
            <div className={`${dotClass} bottom-[18%] left-[18%]`}></div>
            <div className={`${dotClass} bottom-[18%] right-[18%]`}></div>
          </>
        );
      case 6:
        return (
          <>
            <div className={`${dotClass} top-[18%] left-[18%]`}></div>
            <div className={`${dotClass} top-[18%] right-[18%]`}></div>
            <div className={`${dotClass} top-1/2 left-[18%] transform -translate-y-1/2`}></div>
            <div className={`${dotClass} top-1/2 right-[18%] transform -translate-y-1/2`}></div>
            <div className={`${dotClass} bottom-[18%] left-[18%]`}></div>
            <div className={`${dotClass} bottom-[18%] right-[18%]`}></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br from-red-500 to-red-700 shadow-[0_4px_6px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.3)] relative border border-red-400 ${className}`}>
      {getDots()}
    </div>
  );
};

export default Dice;
