import { Injectable, WritableSignal, signal } from '@angular/core';
import { Card } from '../models/models';

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
          originalSize: { x: 16, y: 16 },
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
