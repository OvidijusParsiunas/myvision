import {
  pointMouseDownEvents, pointMouseOverEvents,
  pointMouseUpEvents, pointMouseOutEvents,
  setRemovablePointsEventsCanvas,
} from './eventsManagers/removePointsOnNewPolygonEventsManager';
// changed

function assignRemovePointsEvents(canvas) {
  setRemovablePointsEventsCanvas(canvas);

  canvas.on('mouse:down', (e) => {
    pointMouseDownEvents(e);
  });

  canvas.on('mouse:over', (e) => {
    pointMouseOverEvents(e);
  });

  canvas.on('mouse:up', (e) => {
    pointMouseUpEvents(e);
  });

  canvas.on('mouse:out', (e) => {
    pointMouseOutEvents(e);
  });
}

export { assignRemovePointsEvents as default };
