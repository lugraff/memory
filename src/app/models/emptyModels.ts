import { Card, Picture, Vector2 } from './models';

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
