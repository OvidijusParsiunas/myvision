import { polygonMouseDownEvents, polygonMouseUpEvents, polygonMoveEvents } from './eventsManagers/editPolygonEventsManager';

function assignDefaultEvents(canvas) {
  canvas.on('mouse:down', (e) => {
    polygonMouseDownEvents(e);
  });

  canvas.on('mouse:up', (e) => {
    polygonMouseUpEvents(e, canvas);
  });

  canvas.on('object:moving', (e) => {
    polygonMoveEvents(e);
  });

  canvas.on('object:scaling', (e) => {
    if (e.target.shapeName === 'bndBox') {
      e.target.width *= e.target.scaleX;
      e.target.height *= e.target.scaleY;
      e.target.scaleX = 1;
      e.target.scaleY = 1;
    }
  });

  canvas.on('mouse:over', (e) => {
    if (e.target && e.target.shapeName !== 'point') {
      e.target.set('fill', 'rgba(255,0,0,0.2)');
      canvas.renderAll();
    }
  });

  canvas.on('mouse:out', (e) => {
    if (e.target && e.target.shapeName !== 'point') {
      if (e.target.shapeName === 'bndBox') {
        e.target.set('fill', 'rgba(255,0,0,0');
      } else if (e.target.shapeName === 'polygon') {
        e.target.set('fill', 'rgba(255,0,0,0.01)');
      }
      canvas.renderAll();
    }
  });
}

export { assignDefaultEvents as default };
