import {
  instantiatePolygon, prepareCanvasForNewPolygon, drawPolygon, movePoints, resumeDrawCanvasPolygon,
} from '../../../objects/polygon/polygon';

// should be moved to event worker
function assignDrawPolygonEvents(canvas, resume) {
  if (!resume) {
    prepareCanvasForNewPolygon(canvas);
  } else {
    resumeDrawCanvasPolygon();
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

  canvas.on('mouse:over', (e) => {
    if (e.target && e.target.selectable) {
      canvas.hoverCursor = 'move';
    } else {
      canvas.hoverCursor = 'crosshair';
    }
  });
}

export { assignDrawPolygonEvents as default };
