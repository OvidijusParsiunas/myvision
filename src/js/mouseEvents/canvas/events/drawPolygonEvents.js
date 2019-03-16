import {
  instantiatePolygon, prepareCanvasForNewPolygon, drawPolygon, movePoints,
} from '../../../canvas/canvasObjects/polygon';

function assignDrawPolygonEvents(canvas) {
  prepareCanvasForNewPolygon(canvas);
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
