import { Injectable, signal } from '@angular/core';
import { Card, MemoryData, Player, Vector2 } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private isPlaying = signal(false);
  public gameData = signal<MemoryData>({
    cards: [],
    player: [],
    round: 0,
    startTime: new Date(),
    status: 'menu',
    actualPlayerId: 0,
    lastZ: 1,
  });
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
    this.gameData.mutate((data) => {
      data.cards = this.generateCards(cardAmount, boardSize);
      data.startTime = new Date();
      data.status = 'playing';
      data.round = 1;
    });
  }

  private generatePlayer(playerAmount: number): Player[] {
    return [];
  }

  private generateCards(cardAmount: number, boardSize: Vector2): Card[] {
    if (cardAmount % 2 !== 0) {
      cardAmount--;
    }
    const newCards: Card[] = [];
    const borderSpace = 20;
    let pos: Vector2 = { x: borderSpace, y: borderSpace };
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
      const cardSize = this.calcCardSize(cardAmount, boardSize, borderSpace);
      newCards.push(
        {
          id: index,
          open: false,
          size: { x: cardSize, y: cardSize },
          position: { x: pos.x, y: pos.y },
          zIndex: 1,
          color: randomColor,
          imgUrl: 'url(assets/' + this.chipsNames[randomChip] + ')',
        },
        {
          id: index + 1,
          open: false,
          size: { x: cardSize, y: cardSize },
          position: { x: pos.x + cardSize, y: pos.y },
          zIndex: 1,
          color: randomColor,
          imgUrl: 'url(assets/' + this.chipsNames[randomChip] + ')',
        }
      );
      pos.x += cardSize * 2;
      if (pos.x >= boardSize.x - cardSize * 2) {
        pos.y += cardSize;
        pos.x = borderSpace;
      }
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

  private calcCardSize(cardAmount: number, boardSize: Vector2, borderSpace: number): number {
    const boardSizeQ = boardSize.x * boardSize.y;
    for (let sidelengthCard = 64; sidelengthCard <= Math.min(boardSize.x-borderSpace, boardSize.y-borderSpace); sidelengthCard += 8) {
      const squareArea = cardAmount * (sidelengthCard + 16) * (sidelengthCard + 16);
      if (squareArea >= boardSizeQ * 0.8) {
        return sidelengthCard;
      }
    }
    return 64;
  }
}
