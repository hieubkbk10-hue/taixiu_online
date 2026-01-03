import React from 'react';
import { Smartphone, RotateCw } from 'lucide-react';
import TaiXiuGame from './components/TaiXiuGame';

function App() {
  return (
    <div className="w-screen min-h-screen bg-gray-900 overflow-hidden relative font-sans">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: "url('/background.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* 
          Orientation Warning Overlay 
          Visible only on Portrait AND screens smaller than 'lg' (1024px).
          Hidden on Landscape.
          Hidden on Large Portrait (Desktop).
        */}
        <div className="hidden portrait:flex lg:portrait:hidden fixed inset-0 z-[9999] bg-slate-950 flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
             <div className="relative mb-8">
                <Smartphone size={80} className="text-gray-600 rotate-90" />
                <RotateCw size={40} className="text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
             </div>
             <h2 className="text-2xl font-bold text-yellow-500 mb-3 uppercase tracking-widest">Xoay Màn Hình</h2>
             <p className="text-gray-400 text-base max-w-xs leading-relaxed">
               Vui lòng xoay ngang thiết bị để có trải nghiệm game tốt nhất.
             </p>
        </div>

        {/* 
          Main Game Container 
          Hidden on Portrait (Mobile/Tablet) to prevent interaction underneath.
          Visible on Landscape OR Large Portrait.
        */}
        <div className="w-full h-full flex items-center justify-center relative portrait:hidden lg:portrait:flex z-10">
            {/* Main Game Component */}
            <TaiXiuGame />
        </div>
    </div>
  );
}

export default App;