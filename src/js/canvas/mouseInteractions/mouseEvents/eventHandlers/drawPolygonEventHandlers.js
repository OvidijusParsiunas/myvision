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

  // export this logic
  canvas.on('mouse:over', (e) => {
    // the change of mouse should be fixed by larger invis circle,
    // call mouse out when to set to movable cursor
    if (e.target && e.target.selectable) {
      if (e.target.shapeName === 'firstPoint') {
        e.target.stroke = 'red';
        canvas.hoverCursor = 'default';
      } else {
        canvas.hoverCursor = 'move';
      }
    } else {
      canvas.hoverCursor = 'crosshair';
    }
    canvas.renderAll();
  });

  canvas.on('mouse:out', (e) => {
    if (e.target && e.target.shapeName === 'firstPoint') {
      e.target.stroke = '#333333';
    }
  });
}
export { assignDrawPolygonEvents as default };
