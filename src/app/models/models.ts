export interface Vector2 {
  x: number;
  y: number;
}

export interface Card {
  id: number;
  open: boolean;
  originalSize: Vector2;
  imgUrl?: string;
  color?: string;
}
