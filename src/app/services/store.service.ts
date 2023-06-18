import { Injectable, WritableSignal, signal } from '@angular/core';

interface Vector2 {
  x: number;
  y: number;
}

interface Card {
  id: number;
  open: boolean;
  originalSize: Vector2;
  imgUrl?: string;
  color?: string;
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  private isPlaying = signal(false);
  public cards = signal<Card[]>([]);

  public setIsPlaying(value: boolean): void {
    this.isPlaying.set(value);
  }

  private generateCards(amount: number): void {
    this.cards.set([]);
    for (let index = 0; index < amount; index++) {
      this.cards.mutate((card) =>
        card.push({
          id: index,
          open: false,
          originalSize: { x: 200, y: 200 },
          color:
            '#' +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10),
        })
      );
    }
    console.log(this.cards());
  }

  constructor() {
    this.generateCards(24);
  }
}
