import {
  prepareCanvasForNewBndBox, instantiateNewBndBox,
  drawBndBox, finishDrawingBndBox,
} from '../../../objects/boundingBox/boundingBox';

function assignDrawBoundingBoxEvents(canvas) {
  prepareCanvasForNewBndBox(canvas);

  canvas.on('mouse:down', () => {
    instantiateNewBndBox();
  });

  canvas.on('mouse:move', (e) => {
    drawBndBox(e);
  });

  canvas.on('mouse:up', (e) => {
    finishDrawingBndBox(e);
  });
}

export { assignDrawBoundingBoxEvents as default };
