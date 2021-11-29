import {
  prepareCanvasForNewBoundingBox, instantiateNewBoundingBox,
  drawBoundingBox, finishDrawingBoundingBox, shapeScrollEvents,
} from '../../../objects/boundingBox/boundingBox.js';

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
}

export { assignDrawBoundingBoxEvents as default };
