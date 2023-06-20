export interface Vector2 {
  x: number;
  y: number;
}

export interface Card {
  id: number;
  open: boolean;
  size: Vector2;
  imgUrl?: string;
  color?: string;
}

export interface MemoryData {
  status: string;
  round: number;
  cards: Card[];
  player: string[];
  startTime: Date;
}
