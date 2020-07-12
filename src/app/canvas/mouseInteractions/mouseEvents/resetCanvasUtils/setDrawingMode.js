import assignDrawPolygonEvents from '../eventHandlers/drawPolygonEventHandlers';
import assignDrawBoundingBoxEvents from '../eventHandlers/drawBndBoxEventHandlers';
import purgeCanvasMouseEvents from './purgeAllMouseHandlers';

function setDrawingMode(mode, canvas) {
  purgeCanvasMouseEvents(canvas);
  if (mode === 'polygon') {
    assignDrawPolygonEvents(canvas);
  } else if (mode === 'boundingBox') {
    assignDrawBoundingBoxEvents(canvas);
  }
}

export { setDrawingMode as default };
