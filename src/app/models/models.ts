export interface Vector2 {
  x: number;
  y: number;
}

export interface Card {
  id: number;
  open: boolean;
  size: Vector2;
  position: Vector2;
  zIndex: number;
  imgUrl?: string;
  color?: string;
}

export interface GameSettings {
  cardAmount: number;
  boardSize: Vector2;
}

export interface Player {
  id: number;
  name: string;
  color: string;
}
