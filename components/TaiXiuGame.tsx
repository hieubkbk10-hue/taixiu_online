import React, { useState, useEffect, useRef } from 'react';
import { 
  Info, 
  X, 
  BarChart2, 
  HelpCircle, 
  FileText, 
  Trophy, 
  MessageCircle, 
  Volume2, 
  VolumeX,
  History,
  User,
  PlusCircle
} from 'lucide-react';
import Dice from './Dice';
import GameButton from './GameButton';
import BettingModal from './BettingModal';
import { DiceValue, GamePhase, BetSide } from '../types';

const INITIAL_BALANCE = 10000000;
const ROUND_TIME = 45;
const LOCK_TIME = 5;

// Sound Effects URLs
const AUDIO_URLS = {
  BGM: '/Invisible.mp3', // Local background music
  SHAKE: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', // Dice Shake
  WIN: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Win
  TICK: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3', // Tick
};

const TaiXiuGame: React.FC = () => {
  // === Game State ===
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [phase, setPhase] = useState<GamePhase>('BETTING'); // BETTING -> LOCK -> ROLLING -> RESULT
  const [dice, setDice] = useState<[DiceValue, DiceValue, DiceValue]>([3, 1, 1]);
  const [history, setHistory] = useState<number[]>([11, 4, 15, 8, 12, 5, 17, 9, 10, 6, 14, 7, 3, 16, 5, 11, 13, 8]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // === User Betting State ===
  const [userBetSide, setUserBetSide] = useState<BetSide | null>(null);
  const [userBetAmount, setUserBetAmount] = useState<number>(0);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);
  const [bettingSideForModal, setBettingSideForModal] = useState<BetSide>('TÀI');

  // === UI/Visual State ===
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [resultSide, setResultSide] = useState<'TÀI' | 'XỈU' | null>(null);
  const [resultTotal, setResultTotal] = useState<number>(0);
  const [userWon, setUserWon] = useState<boolean | null>(null);
  
  // === Fake Live Data State ===
  const [fakeTaiAmount, setFakeTaiAmount] = useState(391504490);
  const [fakeXiuAmount, setFakeXiuAmount] = useState(381204100);
  const [fakeTaiUsers, setFakeTaiUsers] = useState(2137);
  const [fakeXiuUsers, setFakeXiuUsers] = useState(1385);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Audio Refs
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const shakeAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // === Request Fullscreen on first interaction ===
  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    }
  };

  // === Audio Initialization ===
  useEffect(() => {
    bgmRef.current = new Audio(AUDIO_URLS.BGM); 
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.4; 

    shakeAudioRef.current = new Audio(AUDIO_URLS.SHAKE);
    winAudioRef.current = new Audio(AUDIO_URLS.WIN);
    tickAudioRef.current = new Audio(AUDIO_URLS.TICK);
    
    // Cleanup
    return () => {
      bgmRef.current?.pause();
    };
  }, []);

  // Handle BGM Toggle
  useEffect(() => {
    if (bgmRef.current) {
      if (soundEnabled) {
        // We catch error here because browsers block autoplay until interaction
        bgmRef.current.play().catch(e => console.log("Audio waiting for interaction"));
      } else {
        bgmRef.current.pause();
      }
    }
  }, [soundEnabled]);

  // Handle Sound Effects based on Phase
  useEffect(() => {
    if (!soundEnabled) return;

    if (phase === 'ROLLING') {
      shakeAudioRef.current?.play().catch(() => {});
    } else if (phase === 'RESULT' && winAmount) {
      winAudioRef.current?.play().catch(() => {});
    }
  }, [phase, winAmount, soundEnabled]);

  // Handle Ticking sound (last 5 seconds)
  useEffect(() => {
    if (soundEnabled && phase === 'BETTING' && timeLeft <= 5 && timeLeft > 0) {
      tickAudioRef.current?.play().catch(() => {});
    }
  }, [timeLeft, phase, soundEnabled]);


  // === Auto-hide Notification ===
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // === Game Loop ===
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
           return 0; // Phase transition handled by effect below
        }
        
        // Check for Lock Phase
        if (phase === 'BETTING' && prev <= LOCK_TIME) {
            setPhase('LOCK');
        }

        return prev - 1;
      });

      // Fake betting fluctuation
      if (phase === 'BETTING' && Math.random() > 0.3) {
         setFakeTaiAmount(prev => prev + Math.floor(Math.random() * 500000));
         setFakeXiuAmount(prev => prev + Math.floor(Math.random() * 500000));
         setFakeTaiUsers(prev => prev + (Math.random() > 0.8 ? 1 : 0));
         setFakeXiuUsers(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      }

    }, 1000);

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  useEffect(() => {
      if (timeLeft === 0) {
        if (phase === 'LOCK') {
            startRolling();
        } else if (phase === 'ROLLING') {
            // Handled by timeout
        } else if (phase === 'RESULT') {
             resetRound();
        }
      }
  }, [timeLeft, phase]);

  const startRolling = () => {
      setPhase('ROLLING');
      // Shake for 2 seconds
      setTimeout(() => {
          finalizeResult();
      }, 2000);
  };

  const finalizeResult = () => {
      // Determine result
      const d1 = Math.ceil(Math.random() * 6) as DiceValue;
      const d2 = Math.ceil(Math.random() * 6) as DiceValue;
      const d3 = Math.ceil(Math.random() * 6) as DiceValue;
      setDice([d1, d2, d3]);
      
      const total = d1 + d2 + d3;
      let won = false;
      let profit = 0;

      const isTriple = (d1 === d2 && d2 === d3);
      const isTai = total >= 11 && total <= 17;
      const isXiu = total >= 4 && total <= 10;
      
      // Set result for display
      const side: 'TÀI' | 'XỈU' = isTai ? 'TÀI' : 'XỈU';
      setResultSide(side);
      setResultTotal(total);
      
      // Calculate Winnings
      if (userBetSide) {
          if (userBetSide === 'TÀI' && isTai && !isTriple) won = true;
          if (userBetSide === 'XỈU' && isXiu && !isTriple) won = true;
          
          if (won) {
              profit = userBetAmount * 2;
          }
          setUserWon(won);
      } else {
          setUserWon(null);
      }

      setPhase('RESULT');
      setTimeLeft(10);

      // Delayed update after bowl animation
      setTimeout(() => {
          if (userBetSide) {
              if (won) {
                  setBalance(b => b + profit);
                  setWinAmount(profit - userBetAmount);
              } else {
                  setWinAmount(null);
              }
          }
          setHistory(prev => [...prev.slice(1), total]);
      }, 1000);
  };

  const resetRound = () => {
      setPhase('BETTING');
      setTimeLeft(ROUND_TIME);
      setUserBetSide(null);
      setUserBetAmount(0);
      setWinAmount(null);
      setNotification(null);
      setResultSide(null);
      setResultTotal(0);
      setUserWon(null);
      
      setFakeTaiAmount(300000000 + Math.floor(Math.random() * 10000000));
      setFakeXiuAmount(300000000 + Math.floor(Math.random() * 10000000));
      setFakeTaiUsers(1000 + Math.floor(Math.random() * 500));
      setFakeXiuUsers(1000 + Math.floor(Math.random() * 500));
  };

  // === Interactions ===
  const openBetModal = (side: BetSide) => {
      if (phase !== 'BETTING') {
          setNotification({ message: 'Đã hết thời gian cược!', type: 'info' });
          return;
      }
      if (userBetSide && userBetSide !== side) {
          setNotification({ message: 'Bạn chỉ được cược 1 cửa!', type: 'error' });
          return;
      }
      setBettingSideForModal(side);
      setIsBettingModalOpen(true);
  };

  const handleConfirmBet = (amount: number) => {
      if (balance < amount) {
           setNotification({ message: 'Số dư không đủ!', type: 'error' });
           return;
      }
      
      setBalance(prev => prev - amount);
      setUserBetAmount(prev => prev + amount); 
      setUserBetSide(bettingSideForModal);
      setIsBettingModalOpen(false);
      setNotification({ message: 'Đặt cược thành công!', type: 'success' });
      
      // Ensure audio context is unlocked on interaction
      if (bgmRef.current && bgmRef.current.paused && soundEnabled) {
          bgmRef.current.play().catch(e => {});
      }
  };

  // === Button Handlers ===
  const handleInfoClick = () => setNotification({ message: 'Luật chơi: Dự đoán tổng điểm 3 viên xúc xắc', type: 'info' });
  const handleCloseClick = () => setNotification({ message: 'Bạn không thể thoát khi đang trong ván!', type: 'error' });
  const handleStatsClick = () => setNotification({ message: 'Mở bảng soi cầu (Demo)', type: 'info' });
  const handleHelpClick = () => setNotification({ message: 'Hỗ trợ trực tuyến 24/7', type: 'info' });
  const handleHistoryClick = () => setNotification({ message: 'Lịch sử đặt cược của bạn', type: 'info' });
  const handleRankingClick = () => setNotification({ message: 'Bảng xếp hạng đại gia tuần', type: 'info' });
  const handleChatClick = () => setNotification({ message: 'Đang kết nối kênh chat...', type: 'info' });
  const handleSoundClick = () => {
      setSoundEnabled(!soundEnabled);
      setNotification({ message: !soundEnabled ? 'Đã bật âm thanh' : 'Đã tắt âm thanh', type: 'info' });
      if (!soundEnabled) {
          bgmRef.current?.play().catch(()=>{});
      }
  };

  // Merge user bet into displayed totals
  const displayTaiAmount = fakeTaiAmount + (userBetSide === 'TÀI' ? userBetAmount : 0);
  const displayXiuAmount = fakeXiuAmount + (userBetSide === 'XỈU' ? userBetAmount : 0);
  const displayTaiUsers = fakeTaiUsers + (userBetSide === 'TÀI' ? 1 : 0);
  const displayXiuUsers = fakeXiuUsers + (userBetSide === 'XỈU' ? 1 : 0);

  return (
    <div className="w-full h-full flex items-center justify-center p-2 md:p-4 overflow-hidden select-none font-sans"
         onClick={() => {
             // Request fullscreen on first tap
             requestFullscreen();
             // Unlock audio context on any click if not started
             if (soundEnabled && bgmRef.current?.paused) bgmRef.current.play().catch(() => {});
         }}
    >
      
      {/* === Notification Toast === */}
      {notification && (
          <div className={`absolute top-[15%] left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl border-2 animate-in fade-in slide-in-from-top-4 duration-300 font-bold tracking-wide whitespace-nowrap
              ${notification.type === 'success' ? 'bg-green-900/95 border-green-500 text-green-100' : 
                notification.type === 'error' ? 'bg-red-900/95 border-red-500 text-red-100' : 
                'bg-blue-900/95 border-blue-500 text-blue-100'}`}>
              {notification.message}
          </div>
      )}

      {/* === Result Overlay - Position below the plate === */}
      {phase === 'RESULT' && resultSide && (
          <div className="absolute z-[60] bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-none">
              <div className="flex flex-col items-center animate-in zoom-in fade-in duration-500 bg-black/80 px-4 py-2 md:px-8 md:py-4 rounded-xl backdrop-blur-sm border border-white/20">
                  {/* Result: TÀI or XỈU */}
                  <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-white font-bold text-base md:text-xl">{resultTotal}</span>
                      <span className={`text-xl md:text-3xl font-black ${resultSide === 'TÀI' ? 'text-red-400' : 'text-blue-400'}`}>
                          {resultSide}
                      </span>
                  </div>
                  
                  {/* User bet result */}
                  {userBetSide && (
                      <div className={`text-sm md:text-xl font-black mt-1 ${userWon ? 'text-green-400' : 'text-red-500'}`}>
                          {userWon ? (
                              <>THẮNG +{formatCurrency(winAmount || 0)} VND</>
                          ) : (
                              <>THUA -{formatCurrency(userBetAmount)} VND</>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}

      <BettingModal 
          isOpen={isBettingModalOpen}
          onClose={() => setIsBettingModalOpen(false)}
          onConfirm={handleConfirmBet}
          side={bettingSideForModal}
          maxBalance={balance}
      />

      {/* Main Table Oval - Responsive for landscape mobile */}
      <div className="relative w-full max-w-7xl h-full max-h-[95vh] bg-cyan-900 rounded-[40px] md:rounded-[100px] lg:rounded-[180px] border-4 border-[#B8860B] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden table-gradient">
        
        {/* Inner Border Decoration */}
        <div className="absolute inset-1.5 md:inset-4 rounded-[35px] md:rounded-[90px] lg:rounded-[170px] border border-cyan-400/30 pointer-events-none"></div>
        


        {/* === CENTER BALANCE (Top Center) === */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20 pointer-events-auto">
             <div 
                 className="bg-black/70 px-3 md:px-4 py-0.5 md:py-1 rounded-full border border-yellow-600/50 shadow-md backdrop-blur-sm cursor-pointer hover:bg-black/90 transition-all active:scale-95 group"
                 onClick={(e) => { 
                     e.stopPropagation(); 
                     setBalance(b => b + 10000000); 
                     setNotification({message: 'Đã nạp 10.000.000 VND!', type:'success'}); 
                 }}
                 title="Nạp tiền nhanh"
             >
                 <div className="flex items-center gap-1 md:gap-1.5">
                     <span className="text-yellow-400 font-bold text-xs md:text-sm tracking-wide drop-shadow-md font-mono">
                         {formatCurrency(balance)} <span className="text-yellow-500/70 text-[8px] md:text-[10px]">VND</span>
                     </span>
                     <PlusCircle size={12} className="text-green-500 group-hover:rotate-90 transition-transform" />
                 </div>
             </div>
        </div>

        {/* === Left Controls (Bottom Left) === */}
        <div className="absolute left-3 md:left-6 bottom-3 md:bottom-6 flex gap-1.5 md:gap-2 z-20">
            <GameButton icon={BarChart2} color="red" onClick={handleStatsClick} />
            <GameButton icon={HelpCircle} color="blue" onClick={handleHelpClick} />
            <GameButton icon={FileText} color="blue" onClick={handleHistoryClick} />
        </div>

        {/* === Right Controls (Bottom Right) === */}
        <div className="absolute right-3 md:right-6 bottom-3 md:bottom-6 flex gap-1.5 md:gap-2 z-20">
            <GameButton icon={Trophy} color="blue" onClick={handleRankingClick} />
            <GameButton icon={MessageCircle} color="blue" onClick={handleChatClick} />
            <GameButton 
                icon={soundEnabled ? Volume2 : VolumeX} 
                color="gray" 
                onClick={handleSoundClick}
            />
        </div>

        {/* === Center Game Area === */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pt-8 md:pt-16 pb-10 md:pb-4 px-8 md:px-24">
            
            {/* TÀI SIDE (LEFT) */}
            <div className={`flex-1 flex flex-col items-center justify-center transition-opacity duration-300 ${phase === 'RESULT' && userBetSide !== 'TÀI' ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}>
                <div className="relative mb-1 md:mb-4 group cursor-pointer" onClick={() => openBetModal('TÀI')}>
                     <h1 className="text-3xl md:text-6xl lg:text-9xl font-black metallic-text tracking-tighter transform scale-y-110 group-hover:scale-110 transition-transform duration-200 py-1 md:py-2">
                        TÀI
                     </h1>
                     {userBetSide === 'TÀI' && (
                         <div className="absolute -top-2 -right-6 md:-top-4 md:-right-4 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-lg border border-white whitespace-nowrap">
                             ĐÃ CƯỢC
                         </div>
                     )}
                </div>
                
                <div className="flex items-center gap-1 text-yellow-200 font-bold mb-0.5 md:mb-1 opacity-90">
                    <User size={10} className="fill-yellow-200 md:w-3 md:h-3" />
                    <span className="text-[10px] md:text-sm">{formatCurrency(displayTaiUsers)}</span>
                </div>

                <div className="text-yellow-400 font-bold text-sm md:text-2xl lg:text-3xl drop-shadow-md mb-1 md:mb-6 tabular-nums tracking-tight">
                    {formatCurrency(displayTaiAmount)}
                </div>

                <button 
                    onClick={() => openBetModal('TÀI')}
                    disabled={phase !== 'BETTING'}
                    className={`bg-gradient-to-b from-yellow-400 to-yellow-600 text-white font-black uppercase text-[10px] md:text-lg lg:text-xl py-1 md:py-2 px-3 md:px-8 rounded-full border-b-2 md:border-b-4 border-yellow-800 shadow-lg active:translate-y-1 active:border-b-0 transition-all whitespace-nowrap min-w-[60px] md:min-w-[140px]
                    ${phase !== 'BETTING' ? 'grayscale opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
                >
                    {userBetSide === 'TÀI' ? `${formatCurrency(userBetAmount)}` : 'CƯỢC'}
                </button>
            </div>

            {/* CENTER PLATE AREA - Responsive */}
            <div className="relative w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 flex-shrink-0 mx-1 md:mx-4">
                 {/* Countdown Timer */}
                 <div className="absolute -top-8 md:-top-14 lg:-top-20 left-1/2 transform -translate-x-1/2 z-30">
                    <div className={`text-4xl md:text-6xl lg:text-8xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] transition-colors duration-300 ${phase === 'LOCK' ? 'text-red-500 animate-pulse' : 'gold-text'}`}>
                        {phase === 'ROLLING' ? '...' : timeLeft}
                    </div>
                 </div>

                 {/* The Plate Background */}
                 <div className="w-full h-full rounded-full gold-border plate-gradient flex items-center justify-center relative shadow-[0_10px_30px_rgba(0,0,0,1)]">
                     
                     {/* Dice Container */}
                     <div className={`relative w-[85%] h-[85%] ${phase === 'ROLLING' ? 'shaking' : ''}`}>
                         
                         {/* DICE (Only visible during RESULT phase) */}
                         <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${phase === 'RESULT' ? 'opacity-100' : 'opacity-0'}`}>
                             <div className="flex gap-1 md:gap-2 items-center justify-center flex-wrap">
                                 <Dice value={dice[0]} className="w-7 h-7 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                                 <Dice value={dice[1]} className="w-7 h-7 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                                 <Dice value={dice[2]} className="w-7 h-7 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                             </div>
                         </div>

                         {/* THE BOWL (LID) - Hidden when RESULT */}
                         {phase !== 'RESULT' && (
                             <div className="absolute inset-0 rounded-full z-20 bowl-gradient border-4 md:border-6 border-[#7f1d1d] flex items-center justify-center shadow-2xl">
                                 {/* Bowl Handle/Decoration */}
                                 <div className="w-8 h-8 md:w-14 md:h-14 lg:w-20 lg:h-20 rounded-full border-2 md:border-4 border-yellow-700/40 bg-gradient-to-br from-red-900 via-red-800 to-black shadow-inner">
                                 </div>
                             </div>
                         )}
                         

                     </div>
                 </div>
                 
                 {/* Status Text under plate */}
                 <div className="absolute -bottom-6 md:-bottom-10 lg:-bottom-12 left-1/2 transform -translate-x-1/2 w-full text-center">
                    <span className="text-cyan-400 font-bold text-[10px] md:text-sm lg:text-lg uppercase tracking-widest drop-shadow-md whitespace-nowrap">
                        {phase === 'BETTING' ? 'ĐẶT CƯỢC' : phase === 'LOCK' ? 'CÂN CỬA' : phase === 'ROLLING' ? 'ĐANG LẮC' : 'KẾT QUẢ'}
                    </span>
                 </div>
            </div>

            {/* XỈU SIDE (RIGHT) */}
             <div className={`flex-1 flex flex-col items-center justify-center transition-opacity duration-300 ${phase === 'RESULT' && userBetSide !== 'XỈU' ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}>
                <div className="relative mb-1 md:mb-4 group cursor-pointer" onClick={() => openBetModal('XỈU')}>
                     <h1 className="text-3xl md:text-6xl lg:text-9xl font-black metallic-text tracking-tighter transform scale-y-110 group-hover:scale-110 transition-transform duration-200 py-1 md:py-2">
                        XỈU
                     </h1>
                     {userBetSide === 'XỈU' && (
                         <div className="absolute -top-2 -right-6 md:-top-4 md:-right-4 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-lg border border-white whitespace-nowrap">
                             ĐÃ CƯỢC
                         </div>
                     )}
                </div>

                <div className="flex items-center gap-1 text-yellow-200 font-bold mb-0.5 md:mb-1 opacity-90">
                    <User size={10} className="fill-yellow-200 md:w-3 md:h-3" />
                    <span className="text-[10px] md:text-sm">{formatCurrency(displayXiuUsers)}</span>
                </div>

                <div className="text-yellow-400 font-bold text-sm md:text-2xl lg:text-3xl drop-shadow-md mb-1 md:mb-6 tabular-nums tracking-tight">
                    {formatCurrency(displayXiuAmount)}
                </div>

                <button 
                    onClick={() => openBetModal('XỈU')}
                    disabled={phase !== 'BETTING'}
                    className={`bg-gradient-to-b from-yellow-400 to-yellow-600 text-white font-black uppercase text-[10px] md:text-lg lg:text-xl py-1 md:py-2 px-3 md:px-8 rounded-full border-b-2 md:border-b-4 border-yellow-800 shadow-lg active:translate-y-1 active:border-b-0 transition-all whitespace-nowrap min-w-[60px] md:min-w-[140px]
                    ${phase !== 'BETTING' ? 'grayscale opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
                >
                    {userBetSide === 'XỈU' ? `${formatCurrency(userBetAmount)}` : 'CƯỢC'}
                </button>
            </div>

        </div>



      </div>
    </div>
  );
};

export default TaiXiuGame;