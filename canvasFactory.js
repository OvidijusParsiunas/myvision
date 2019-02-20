import fabric from 'fabric';
import assignCanvasMouseEvents from './canvasMouseEvents';

function thisWillBeRemoved(canvas) {
  canvas.setBackgroundColor({ source: 'sample-img.jpg', repeat: 'repeat' }, () => {
    canvas.renderAll();
  });
  return canvas;
}

function constructCanvas() {
  const canvas = new fabric.Canvas('c', { selection: false });
  fabric.Object.prototype.transparentCorners = false;
  assignCanvasMouseEvents(canvas);
  return thisWillBeRemoved(canvas);
}

export { constructCanvas as default };
