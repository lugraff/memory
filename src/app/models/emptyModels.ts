import { Card, MemoryState, Picture, Vector2 } from './models';

const emptyPictureRef: Picture = {
  name: '-',
  offset: { x: 0, y: 0 },
  url: '',
};
export const emptyPicture = JSON.parse(JSON.stringify(emptyPictureRef));

const emptyCardRef: Card = {
  id: -1,
  open: false,
  signal: '',
  size: { x: 0, y: 0 },
  position: { x: 0, y: 0 },
  duration: 200,
  rotation: 0,
  zIndex: 1,
  backNr: 1,
  picture: emptyPicture,
};
export const emptyCard = JSON.parse(JSON.stringify(emptyCardRef));

const emptyVector2Ref: Vector2 = {
  x: 0,
  y: 0,
};
export const emptyVector2 = JSON.parse(JSON.stringify(emptyVector2Ref));

const emptyMemoryStateRef: MemoryState = {
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
  inputCardCount: 18,
  inputPlayerCount: 1,
  inputKiCount: 0,
};
export const emptyMemoryState = JSON.parse(JSON.stringify(emptyMemoryStateRef));
