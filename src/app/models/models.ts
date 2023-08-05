export interface MemoryState {
  status: string;
  turnAllowed: boolean;
  playAgainMode: boolean;
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
  pictureList: Picture[];
  inputCardCount: number;
  inputPlayerCount: number;
  inputKiCount: number;
}

export interface Card {
  id: number;
  open: boolean;
  signal: string;
  size: Vector2;
  position: Vector2;
  duration: number;
  rotation: number;
  zIndex: number;
  backNr: number;
  picture: Picture;
  color?: string;
}

export interface Picture {
  name: string;
  offset: Vector2;
  url: string;
  sourceUrl?: string;
  licence?: string;
  author?: string;
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
  points: number;
  ki: boolean;
  kiMemory: number[];
}

export interface Vector2 {
  x: number;
  y: number;
}
