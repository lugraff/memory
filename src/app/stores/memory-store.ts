import { Injectable, signal } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Card, GameSettings, Player, Vector2 } from '../models/models';
import { shuffleArray } from '../utils/helper-functions';

interface MemoryState {
  status: string;
  round: number;
  lastOpenedCardIds: number[];
  cards: Card[];
  player: Player[];
  actualPlayerId: number;
  startTime: Date;
  lastZ: number;
}

@Injectable()
export class MemoryStore extends ComponentStore<MemoryState> {
  private readonly chipsNames = [
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

  constructor() {
    super({
      cards: [],
      player: [],
      round: 0,
      lastOpenedCardIds: [],
      startTime: new Date(),
      status: 'menu',
      actualPlayerId: 0,
      lastZ: 1,
    });
  }

  public setCardIndex = this.updater((state, cardId: number) => {
    const cards = state.cards;
    cards[cardId].zIndex = state.lastZ;
    return { ...state, cards: cards, lastZ: state.lastZ + 1 };
  });
  public setCardOpenOrClosed = this.updater((state, prop: { cardId: number; openOrClosed: boolean }) => {
    const cards = state.cards;
    cards[prop.cardId].zIndex = state.lastZ;
    cards[prop.cardId].open = prop.openOrClosed;
    return { ...state, cards: cards, lastZ: state.lastZ + 1 };
  });
  public setCardPosition = this.updater((state, prop: { cardId: number; newPosition: Vector2 }) => {
    const cards = state.cards;
    cards[prop.cardId].position = prop.newPosition;
    return { ...state, cards: cards };
  });
  public setCardSignal = this.updater((state, prop: { cardId: number; signal: string }) => {
    const cards = state.cards;
    cards[prop.cardId].signal = prop.signal;
    return { ...state, cards: [...cards] };
  });

  public addlastOpenedCardIds = this.updater((state, cardId: number) => {
    const lastOpenedCardIds = state.lastOpenedCardIds;
    lastOpenedCardIds.push(cardId);
    return { ...state, lastOpenedCardIds: lastOpenedCardIds };
  });
  public resetlastOpenedCardIds = this.updater((state) => {
    return { ...state, lastOpenedCardIds: [] };
  });

  public cardsS = this.selectSignal((state) => {
    return state.cards;
  });

  public statusS = this.selectSignal((state) => {
    return state.status;
  });

  public lastOpenedCardIdsS = this.selectSignal((state) => {
    return state.lastOpenedCardIds;
  });

  public generateNewGame = this.updater((state, gameSettings: GameSettings) => {
    const cards = this.generateCards(gameSettings.cardAmount, gameSettings.boardSize);
    const startTime = new Date();
    const status = 'playing';
    const round = 1;
    return { ...state, cards, startTime, status, round };
  });

  private generatePlayer(playerAmount: number): Player[] {
    return [];
  }

  private generateCards(cardAmount: number, boardSize: Vector2): Card[] {
    if (cardAmount % 2 !== 0) {
      cardAmount--;
    }
    const newCards: Card[] = [];
    const borderSpace = 20;
    const gap = 16;
    const sidelengthCard = this.calcCardSize(cardAmount, boardSize, borderSpace, gap);
    const positions: Vector2[] = this.calcPositions(cardAmount, sidelengthCard, boardSize, borderSpace, gap);
    const backNr = Math.round(Math.random() + 1);
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
      newCards.push(
        {
          id: index,
          open: false,
          signal: '',
          size: { x: sidelengthCard, y: sidelengthCard },
          position: { x: positions[positions.length - 1].x, y: positions[positions.length - 1].y },
          zIndex: 1,
          color: randomColor,
          imgUrl: 'url(assets/' + this.chipsNames[randomChip] + ')',
          backNr: backNr,
        },
        {
          id: index + 1,
          open: false,
          signal: '',
          size: { x: sidelengthCard, y: sidelengthCard },
          position: { x: positions[positions.length - 2].x, y: positions[positions.length - 2].y },
          zIndex: 1,
          color: randomColor,
          imgUrl: 'url(assets/' + this.chipsNames[randomChip] + ')',
          backNr: backNr,
        }
      );
      positions.pop();
      positions.pop();
    }
    return newCards;
  }

  private calcCardSize(cardAmount: number, boardSize: Vector2, borderSpace: number, gap: number): number {
    const boardSizeQ = boardSize.x * boardSize.y;
    for (
      let sidelengthCard = 64;
      sidelengthCard <= Math.min(boardSize.x - borderSpace - gap, boardSize.y - borderSpace - gap);
      sidelengthCard += 8
    ) {
      const squareArea = cardAmount * sidelengthCard * sidelengthCard;
      if (squareArea >= boardSizeQ || sidelengthCard >= 196) {
        return sidelengthCard;
      }
    }
    return 64;
  }

  private calcPositions(
    cardAmount: number,
    sidelengthCard: number,
    boardSize: Vector2,
    borderSpace: number,
    gap: number
  ): Vector2[] {
    const positions: Vector2[] = [];
    let newX = borderSpace;
    let newY = borderSpace;
    for (let index = 0; index < cardAmount; index++) {
      positions.push({ x: newX, y: newY });
      newX += sidelengthCard + Math.random() * 2 + gap;
      newY += (Math.random() - 0.5) * 2;
      if (newX >= boardSize.x - sidelengthCard - gap) {
        newX = borderSpace + Math.random() * 2 + gap;
        newY += sidelengthCard + gap;
      }
    }
    shuffleArray(positions);
    return positions;
  }
}
