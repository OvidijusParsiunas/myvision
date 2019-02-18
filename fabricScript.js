import fabric from 'fabric';
import {
  setCanvas, drawBndBox, finishDrawingBndBox, highlightBndBox, removeBndBoxHighlight,
  createNewBndBox,
} from './boundingBox';

function assignMouseEvents(canvas) {
  setCanvas(canvas);
  window.createNewBndBox = createNewBndBox;
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

function constructCanvas() {
  const canvas = new fabric.Canvas('c', { selection: false });
  // will be removed later
  canvas.setBackgroundColor({ source: 'sample-img.jpg', repeat: 'repeat' }, () => {
    canvas.renderAll();
  });
  fabric.Object.prototype.transparentCorners = false;
  assignMouseEvents(canvas);
  return canvas;
}

export { constructCanvas as default };
