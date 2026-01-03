import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  side: 'TÀI' | 'XỈU';
  maxBalance: number;
}

const BettingModal: React.FC<BettingModalProps> = ({ isOpen, onClose, onConfirm, side, maxBalance }) => {
  const [amount, setAmount] = useState<number>(0);

  if (!isOpen) return null;

  const quickAmounts = [100000, 500000, 1000000, 5000000, 10000000];

  const handleQuickAdd = (val: number) => {
    if (amount + val <= maxBalance) {
      setAmount(prev => prev + val);
    } else {
      setAmount(maxBalance);
    }
  };

  const handleAllIn = () => {
    setAmount(maxBalance);
  };

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-800 border-2 border-yellow-600 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className={`p-4 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700`}>
          <h2 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-2 drop-shadow-md">
            <span className="text-yellow-400">ĐẶT CƯỢC</span>
            <span className="text-white">{side}</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Input Display */}
          <div className="bg-black/50 p-4 rounded-xl border border-gray-600 flex flex-col items-end">
             <span className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Số tiền cược</span>
             <div className="text-3xl font-mono font-bold text-yellow-400 w-full text-right outline-none bg-transparent">
                {formatCurrency(amount)}
             </div>
             <div className="text-xs text-gray-500 mt-1">
                Số dư: {formatCurrency(maxBalance)}
             </div>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((val) => (
              <button 
                key={val}
                onClick={() => handleQuickAdd(val)}
                className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white py-2 rounded-lg font-medium text-xs md:text-sm border border-slate-600 transition-colors shadow-sm"
              >
                +{formatCurrency(val)}
              </button>
            ))}
            <button 
                onClick={handleAllIn}
                className="bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-800 py-2 rounded-lg font-bold text-xs md:text-sm transition-colors"
            >
                ALL IN
            </button>
          </div>

           {/* Keypad / Clear / Reset Actions */}
           <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setAmount(0)}
                className="flex-1 py-3 rounded-xl font-bold text-gray-400 bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors"
              >
                Làm lại
              </button>
              <button 
                onClick={() => onConfirm(amount)}
                disabled={amount <= 0 || amount > maxBalance}
                className="flex-[2] py-3 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Xác Nhận
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default BettingModal;