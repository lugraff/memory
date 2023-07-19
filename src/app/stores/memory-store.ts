import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Card, GameSettings, MemoryState, Picture, Player, Vector2 } from '../models/models';
import { shuffleArray } from '../utils/helper-functions';
import { LimitNumber } from '../pipes/limit-number.pipe';
import { MachineInfoService } from '../services/machine-info-service';
import { Observable, delay, interval, take } from 'rxjs';
import { ConnectorService } from '../services/connector.service';
import { generate } from '../utils/color-generator';

@Injectable()
export class MemoryStore extends ComponentStore<MemoryState> {
  private limit = inject(LimitNumber);
  private machine = inject(MachineInfoService);
  private connector = inject(ConnectorService);

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

  private readonly local = true;
  private loadedCounter = 0;
  private intervalTimer = interval(200);

  constructor() {
    super({
      cards: [],
      player: [],
      round: 0,
      lastOpenedCardIds: [],
      startTime: new Date(),
      status: 'menu',
      turnAllowed: true,
      playAgainMode: false,
      circleStatus: '',
      circlePos: { x: innerWidth * 0.5 - 128, y: innerHeight * 0.5 - 128 },
      circleScale: 1.5,
      actualPlayerId: 0,
      lastZ: 1,
      pictureList: [],
    });
    this.loadPictureList()
      .pipe(take(1))
      .subscribe((result) => {
        this.patchState({ pictureList: result });
        setTimeout(() => {
          this.loadImages();
        }, 1000);
      });
  }

  private loadPictureList(): Observable<Picture[]> {
    if (this.local) {
      return this.connector.get('./assets/pictureList.json');
    } else {
      return this.connector.get('./assets/pictureList.json');
    }
  }

  private loadImages() {
    for (let i = 0; i < this.pictureListS().length; i++) {
      const img = new Image();
      img.onload = () => {
        this.loaded();
      };
      img.src = this.pictureListS()[i].url;
    }
  }

  private loaded() {
    this.loadedCounter++;
    if (this.pictureListS().length == this.loadedCounter) {
      console.log('ALL Loaded');
    }
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

  public setCardDuration = this.updater((state, prop: { cardId: number; newDuration: number }) => {
    const cards = state.cards;
    cards[prop.cardId].duration = prop.newDuration;
    return { ...state, cards: cards };
  });

  public setCardRotation = this.updater((state, prop: { cardId: number; newRotation: number }) => {
    const cards = state.cards;
    cards[prop.cardId].rotation = prop.newRotation;
    return { ...state, cards: cards };
  });

  public setCardSignal = this.updater((state, prop: { cardId: number; signal: string }) => {
    const cards = state.cards;
    cards[prop.cardId].signal = prop.signal;
    return { ...state, cards: [...cards] };
  });

  public addPoint = this.updater((state, playerId: number) => {
    const player = state.player;
    player[playerId].points++;
    return { ...state, player: [...player] };
  });

  public addlastOpenedCardIds = this.updater((state, cardId: number) => {
    const lastOpenedCardIds = state.lastOpenedCardIds;
    lastOpenedCardIds.push(cardId);
    return { ...state, lastOpenedCardIds: lastOpenedCardIds };
  });
  public resetlastOpenedCardIds = this.updater((state) => {
    return { ...state, lastOpenedCardIds: [] };
  });

  public addMemory = this.updater((state, cardId: number) => {
    const players = state.player;
    for (const player of players) {
      if (player.ki && !player.kiMemory.includes(cardId)) {
        player.kiMemory.push(cardId);
      }
    }
    return { ...state, player: [...players] };
  });

  public removeMemory = this.updater((state, cardId: number) => {
    const players = state.player;
    for (const player of players) {
      if (player.ki) {
        player.kiMemory = player.kiMemory.filter((index) => index !== cardId);
      }
    }
    return { ...state, player: [...players] };
  });

  public pictureListS = this.selectSignal((state) => {
    return state.pictureList;
  });

  public cardsS = this.selectSignal((state) => {
    return state.cards;
  });

  public statusS = this.selectSignal((state) => {
    return state.status;
  });
  public setStatus = this.updater((state, status: string) => {
    return { ...state, status };
  });

  public turnAllowedS = this.selectSignal((state) => {
    return state.turnAllowed;
  });
  public setTurnAllowed = this.updater((state, turnAllowed: boolean) => {
    return { ...state, turnAllowed };
  });

  public playAgainModeS = this.selectSignal((state) => {
    return state.playAgainMode;
  });
  public setPlayAgainMode = this.updater((state, playAgainMode: boolean) => {
    return { ...state, playAgainMode };
  });

  public circleStatusS = this.selectSignal((state) => {
    return state.circleStatus;
  });
  public setCircleStatus = this.updater((state, circleStatus: string) => {
    return { ...state, circleStatus };
  });

  public circlePosS = this.selectSignal((state) => {
    return state.circlePos;
  });
  public setCirclePos = this.updater((state, circlePos: Vector2) => {
    return { ...state, circlePos };
  });

  public circleScaleS = this.selectSignal((state) => {
    return state.circleScale;
  });
  public setCircleScale = this.updater((state, circleScale: number) => {
    return { ...state, circleScale };
  });

  public lastOpenedCardIdsS = this.selectSignal((state) => {
    return state.lastOpenedCardIds;
  });

  public playerS = this.selectSignal((state) => {
    return state.player;
  });

  public actualPlayerIdS = this.selectSignal((state) => {
    return state.actualPlayerId;
  });
  public nextPlayer = this.updater((state) => {
    const nextPlayer = this.limit.transform(++state.actualPlayerId, 0, state.player.length - 1, true);
    return { ...state, actualPlayerId: nextPlayer };
  });

  public playKiTurn(): void {
    // console.log(JSON.stringify(this.playerS()[1].kiMemory));
    let firstCard = Math.floor(Math.random() * this.cardsS().length);
    let trys = 32;
    while (
      (this.cardsS()[firstCard].open || this.playerS()[this.actualPlayerIdS()].kiMemory.includes(firstCard)) &&
      trys-- >= 0
    ) {
      firstCard = Math.floor(Math.random() * this.cardsS().length);
    }
    this.addMemory(firstCard);
    let secondCard = Math.floor(Math.random() * this.cardsS().length);
    let foundCards = false;
    for (const cardId of this.playerS()[this.actualPlayerIdS()].kiMemory) {
      if (cardId % 2 !== 0) {
        if (this.playerS()[this.actualPlayerIdS()].kiMemory.includes(cardId - 1)) {
          firstCard = cardId;
          secondCard = cardId - 1;
          foundCards = true;
          break;
        }
      } else {
        if (this.playerS()[this.actualPlayerIdS()].kiMemory.includes(cardId + 1)) {
          firstCard = cardId;
          secondCard = cardId + 1;
          foundCards = true;
          break;
        }
      }
    }
    if (!foundCards) {
      trys = 32;
      while (
        (firstCard === secondCard ||
          this.cardsS()[secondCard].open ||
          this.playerS()[this.actualPlayerIdS()].kiMemory.includes(secondCard)) &&
        trys-- >= 0
      ) {
        secondCard = Math.floor(Math.random() * this.cardsS().length);
      }
    }
    this.addMemory(secondCard);
    this.setCardSignal({ cardId: firstCard, signal: 'open' });
    const secondCheck$ = this.intervalTimer.subscribe(() => {
      if (this.turnAllowedS()) {
        this.setCardSignal({ cardId: secondCard, signal: 'open' });
        secondCheck$.unsubscribe();
      }
    });
  }

  public roundS = this.selectSignal((state) => {
    return state.round;
  });
  public nextRound = this.updater((state) => {
    if (state.player[this.actualPlayerIdS()].ki) {
      this.playKiTurn();
    }
    return { ...state, round: state.round + 1 };
  });

  public generateNewGame = this.updater((state, gameSettings: GameSettings) => {
    const cards = this.generateCards(gameSettings.cardAmount, gameSettings.boardSize);
    const startTime = new Date();
    const status = 'playing';
    const round = 1;
    const player = this.generatePlayer(gameSettings.playerCount);
    const ki = this.generateKI(gameSettings.kiCount, player.length);
    player.push(...ki);
    return { ...state, cards, startTime, status, round, player };
  });

  private generatePlayer(playerAmount: number): Player[] {
    const player: Player[] = [];
    const colors: string[] = ['red', 'green', 'blue', 'yellow'];
    shuffleArray(colors);
    for (let index = 0; index < playerAmount; index++) {
      player.push({
        name: 'Spieler ' + (index + 1),
        id: index,
        color: colors[index],
        ki: false,
        points: 0,
        kiMemory: [],
      });
    }
    return player;
  }

  private generateKI(kiAmount: number, playerCount: number): Player[] {
    const ki: Player[] = [];
    const colors: string[] = ['cyan', 'purple', 'white', 'orange'];
    shuffleArray(colors);
    for (let index = 0; index < kiAmount; index++) {
      ki.push({
        name: 'KI ' + (index + 1),
        id: index + playerCount,
        color: colors[index],
        ki: true,
        points: 0,
        kiMemory: [],
      });
    }
    return ki;
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
    const shuffledPics = shuffleArray([...this.pictureListS()]);
    const backNr = Math.round(Math.random() + 1);
    for (let index = 0; index < cardAmount; index += 2) {
      const randomColor = generate(Math.random(), 0.8, 0.8);
      newCards.push(
        {
          id: index,
          open: false,
          signal: '',
          size: { x: sidelengthCard, y: sidelengthCard },
          position: { x: positions[positions.length - 1].x, y: positions[positions.length - 1].y },
          duration: 200,
          rotation: (Math.random() - 0.5) * 9,
          zIndex: 0,
          color: randomColor,
          picture: shuffledPics[shuffledPics.length - 1],
          backNr: backNr,
        },
        {
          id: index + 1,
          open: false,
          signal: '',
          size: { x: sidelengthCard, y: sidelengthCard },
          position: { x: positions[positions.length - 2].x, y: positions[positions.length - 2].y },
          duration: 200,
          rotation: (Math.random() - 0.5) * 9,
          zIndex: 0,
          color: randomColor,
          picture: shuffledPics[shuffledPics.length - 1],
          backNr: backNr,
        },
      );
      shuffledPics.pop();
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
      let squareArea = cardAmount * sidelengthCard * sidelengthCard;
      if (this.machine.isMobile) {
        squareArea *= 2.2;
      } else {
        squareArea *= 1.8;
      }
      if (squareArea >= boardSizeQ || sidelengthCard >= 256) {
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
    gap: number,
  ): Vector2[] {
    const positions: Vector2[] = [];
    let newX = borderSpace;
    let newY = borderSpace;
    for (let index = 0; index < cardAmount; index++) {
      positions.push({ x: newX, y: newY });
      newX += sidelengthCard + Math.random() * 2 + gap;
      newY += (Math.random() - 0.5) * 2;
      if (newX >= boardSize.x - sidelengthCard - gap) {
        newX = borderSpace;
        newY += sidelengthCard + gap;
      }
    }
    shuffleArray(positions);
    return positions;
  }

  startOutroAnimation(): void {
    this.setCircleStatus('gameFinish');
    this.setCirclePos({ x: 0, y: 0 });
    this.setCircleScale(1.75);
    setTimeout(() => {
      for (const card of this.cardsS()) {
        this.setCardPosition({
          cardId: card.id,
          newPosition: { x: card.position.x + (Math.random() - 0.5) * 42, y: innerHeight + card.size.y * 2 },
        });
        this.setCardDuration({ cardId: card.id, newDuration: 3333 });
        this.setCardRotation({ cardId: card.id, newRotation: (Math.random() - 0.5) * 700 });
      }
    }, 1000);
  }
}
