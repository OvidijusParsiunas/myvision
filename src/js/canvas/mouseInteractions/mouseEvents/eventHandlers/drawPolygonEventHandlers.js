import {
  instantiatePolygon, prepareCanvasForNewPolygon,
  drawPolygon, movePoints, resumeDrawingAfterRemovePoints,
  placeholderToAddMouseDownEvents, changeInitialPointColour,
  shapeScrollEvents,
} from '../../../objects/polygon/polygon';

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

  // export this logic
  canvas.on('mouse:over', (e) => {
    if (e.target && e.target.selectable) {
      if (e.target.shapeName === 'invisiblePoint') {
        changeInitialPointColour('red');
      }
    }
  });

  canvas.on('mouse:out', (e) => {
    if (e.target && e.target.shapeName === 'invisiblePoint') {
      changeInitialPointColour('#333333');
    }
  });
}
export { assignDrawPolygonEvents as default };
