import {
  prepareCanvasForNewBoundingBox, instantiateNewBoundingBox,
  drawBoundingBox, finishDrawingBoundingBox, shapeScrollEvents,
} from '../../../objects/boundingBox/boundingBox';
import { hideCrosshair } from '../../cursorModes/drawWithCrosshairMode';

function assignDrawBoundingBoxEvents(canvas) {
  prepareCanvasForNewBoundingBox(canvas);

  canvas.on('mouse:down', () => {
    instantiateNewBoundingBox();
  });

  canvas.on('mouse:move', (e) => {
    drawBoundingBox(e);
  });

  canvas.on('mouse:up', () => {
    finishDrawingBoundingBox();
  });

  canvas.on('mouse:wheel', (e) => {
    shapeScrollEvents(e);
  });

  canvas.on('mouse:out', () => {
    hideCrosshair(canvas);
  });
}

export { assignDrawBoundingBoxEvents as default };
