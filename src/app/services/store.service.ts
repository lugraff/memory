import { Injectable, signal } from '@angular/core';
import { Card, MemoryData, Vector2 } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private isPlaying = signal(false);
  public gameData = signal<MemoryData>({ cards: [], player: [], round: 0, startTime: new Date(), status: 'menu' });
  private chipsNames = [
    'deer.png',
    'dolphin.png',
    'eagle.png',
    'gecko.png',
    'horse.png',
    'snail.png',
    'snake.png',
    'squirrel.png',
    'turtle.png',
  ];

  public setIsPlaying(value: boolean): void {
    this.isPlaying.set(value);
  }

  public generateNewGame(cardAmount: number, boardSize: Vector2): void {
    this.gameData.mutate((data) => (data.cards = this.generateCards(cardAmount, boardSize)));
  }

  private generateCards(cardAmount: number, boardSize: Vector2): Card[] {
    if (cardAmount % 2 !== 0) {
      cardAmount--;
    }
    const newCards: Card[] = [];
    for (let index = 0; index < cardAmount; index += 2) {
      const randomChip = Math.floor(Math.random() * 8);
      const randomColor =
        '#' +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10);
      const cardSize = this.calcCardSize(cardAmount, boardSize);
      newCards.push(
        {
          id: index,
          open: false,
          size: { x: cardSize, y: cardSize },
          color: randomColor,
          imgUrl: 'url(assets/' + this.chipsNames[randomChip] + ')',
        },
        {
          id: index + 1,
          open: false,
          size: { x: cardSize, y: cardSize },
          color: randomColor,
          imgUrl: 'url(assets/' + this.chipsNames[randomChip] + ')',
        }
      );
    }
    this.shuffleArray(newCards);
    return newCards;
  }

  private shuffleArray(array: Card[]) {
    let m = array.length,
      t,
      i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  private calcCardSize(cardAmount: number, boardSize: Vector2): number {
    const boardSizeQ = boardSize.x * boardSize.y;
    for (let sidelengthCard = 64; sidelengthCard <= Math.min(boardSize.x, boardSize.y); sidelengthCard += 8) {
      const squareArea = cardAmount * (sidelengthCard + 16) * (sidelengthCard + 16);
      if (squareArea >= boardSizeQ * 0.9) {
        return sidelengthCard;
      }
    }
    return 64;
  }
}
