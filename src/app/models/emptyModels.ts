import { Card, Vector2 } from './models';

const emptyCardRef: Card = {
  id: -1,
  open: false,
  size: { x: 0, y: 0 },
  position: { x: 0, y: 0 },
  zIndex: 1,
};
export const emptyCard = JSON.parse(JSON.stringify(emptyCardRef));

const emptyVector2Ref: Vector2 = {
  x: 0,
  y: 0,
};
export const emptyVector2 = JSON.parse(JSON.stringify(emptyVector2Ref));
