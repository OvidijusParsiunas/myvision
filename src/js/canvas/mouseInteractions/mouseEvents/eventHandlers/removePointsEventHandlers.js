import {
  pointMouseDownEvents, pointMouseOverEvents,
  pointMouseUpEvents, pointMouseOutEvents,
  setRemovablePointsEventsCanvas,
} from '../eventWorkers/removePointsEventsWorker';

function assignRemovePointsOnExistingPolygonEvents(canvas) {
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

export { assignRemovePointsOnExistingPolygonEvents as default };
