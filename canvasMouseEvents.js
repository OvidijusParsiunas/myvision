import {
  setBndBoxCanvas, instantiateNewBndBox, drawBndBox,
  finishDrawingBndBox, highlightBndBox, removeBndBoxHighlight,
} from './boundingBox';

function boundingBoxEvents(canvas) {
  setBndBoxCanvas(canvas);

  canvas.on('mouse:down', () => {
    instantiateNewBndBox();
  });

  canvas.on('mouse:over', (o) => {
    highlightBndBox(o);
  });

  canvas.on('mouse:out', (o) => {
    removeBndBoxHighlight(o);
  });

  canvas.on('mouse:move', (o) => {
    drawBndBox(o);
  });

  canvas.on('mouse:up', (o) => {
    finishDrawingBndBox(o);
  });
}

function assignCanvasMouseEvents(canvas) {
  boundingBoxEvents(canvas);
}

export { assignCanvasMouseEvents as default };
