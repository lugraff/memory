export interface MemoryState {
  status: string;
  circleStatus: string;
  circlePos: Vector2;
  circleScale: number;
  round: number;
  lastOpenedCardIds: number[];
  cards: Card[];
  player: Player[];
  actualPlayerId: number;
  startTime: Date;
  lastZ: number;
}

export interface Card {
  id: number;
  open: boolean;
  signal: string;
  size: Vector2;
  position: Vector2;
  zIndex: number;
  backNr: number;
  imgUrl?: string;
  color?: string;
}

export interface GameSettings {
  cardAmount: number;
  playerCount: number;
  kiCount: number;
  boardSize: Vector2;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  ki: boolean;
  points: number;
}

export interface Vector2 {
  x: number;
  y: number;
}
