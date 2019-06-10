import {
  instantiatePolygon, prepareCanvasForNewPolygon, drawPolygon,
  movePoints, resumeDrawingAfterRemovePoints, changeInitialPointColour,
} from '../../../objects/polygon/polygon';

// should be moved to event worker
function assignDrawPolygonEvents(canvas, resume) {
  if (!resume) {
    prepareCanvasForNewPolygon(canvas);
  } else {
    resumeDrawingAfterRemovePoints();
  }
  canvas.on('mouse:down', (e) => {
    if (!e.target || (e.target && e.target.shapeName !== 'tempPoint')) {
      instantiatePolygon(e);
    }
  });

  canvas.on('object:moving', (e) => {
    movePoints(e);
  });

  canvas.on('mouse:move', (e) => {
    drawPolygon(e);
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
