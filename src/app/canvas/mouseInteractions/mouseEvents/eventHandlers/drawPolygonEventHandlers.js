import {
  polygonMouseOverEvents, polygonMouseOutEvents,
  instantiatePolygon, prepareCanvasForNewPolygon,
  placeholderToAddMouseDownEvents, shapeScrollEvents,
  drawPolygon, movePoints, resumeDrawingAfterRemovePoints,
} from '../../../objects/polygon/polygon.js';

// should be moved to event worker
function assignDrawPolygonEvents(canvas, resume) {
  if (!resume) {
    prepareCanvasForNewPolygon(canvas);
  } else {
    resumeDrawingAfterRemovePoints();
  }
  canvas.on('mouse:down', (e) => {
    instantiatePolygon(e);
  });

  canvas.on('object:moving', (e) => {
    movePoints(e);
  });

  canvas.on('mouse:move', (e) => {
    drawPolygon(e);
  });

  canvas.on('mouse:up', () => {
    placeholderToAddMouseDownEvents();
  });

  canvas.on('mouse:wheel', (e) => {
    shapeScrollEvents(e);
  });

  canvas.on('mouse:over', (e) => {
    polygonMouseOverEvents(e);
  });

  canvas.on('mouse:out', (e) => {
    polygonMouseOutEvents(e);
  });
}
export { assignDrawPolygonEvents as default };
