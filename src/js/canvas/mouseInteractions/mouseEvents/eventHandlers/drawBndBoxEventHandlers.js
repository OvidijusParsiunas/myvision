import {
  prepareCanvasForNewBoundingBox, instantiateNewBoundingBox,
  drawBoundingBox, finishDrawingBoundingBox, shapeScrollEvents,
} from '../../../objects/boundingBox/boundingBox';

function assignDrawBoundingBoxEvents(canvas) {
  prepareCanvasForNewBoundingBox(canvas);

  canvas.on('mouse:down', () => {
    instantiateNewBoundingBox();
  });

  canvas.on('mouse:move', (e) => {
    drawBoundingBox(e);
  });

  canvas.on('mouse:up', (e) => {
    finishDrawingBoundingBox(e);
  });

  canvas.on('mouse:wheel', (e) => {
    shapeScrollEvents(e);
  });
}

export { assignDrawBoundingBoxEvents as default };
