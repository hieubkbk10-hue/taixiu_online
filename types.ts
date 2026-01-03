export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
export type GamePhase = 'BETTING' | 'LOCK' | 'ROLLING' | 'RESULT';
export type BetSide = 'TÀI' | 'XỈU';

export interface GameState {
  dice: [DiceValue, DiceValue, DiceValue];
  phase: GamePhase;
  timeLeft: number;
  history: number[];
  taiBet: number;
  xiuBet: number;
  taiUsers: number;
  xiuUsers: number;
}
