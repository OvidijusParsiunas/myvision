import {
  instantiatePolygon, prepareCanvasForNewPolygon, drawPolygon,
} from '../../../canvas/canvasObjects/polygon';

function assignDrawPolygonEvents(canvas) {
  prepareCanvasForNewPolygon(canvas);
  // if selected, stretch
  canvas.on('mouse:down', (e) => {
    instantiatePolygon(e);
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
