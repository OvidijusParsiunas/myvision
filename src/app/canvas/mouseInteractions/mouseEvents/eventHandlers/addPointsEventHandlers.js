import {
  pointMouseDownEvents, setAddPointsEventsCanvas, pointMouseUpEvents,
  mouseMove, mouseOverEvents, moveAddPoints, mouseOutEvents, shapeScrollEvents,
} from '../eventWorkers/addPointsEventsWorker.js';

function assignAddPointsOnExistingPolygonEvents(canvas) {
  setAddPointsEventsCanvas(canvas);

  canvas.on('mouse:down', (e) => {
    pointMouseDownEvents(e);
  });

  canvas.on('mouse:over', (e) => {
    mouseOverEvents(e);
  });

  canvas.on('mouse:move', (e) => {
    mouseMove(e);
  });

  canvas.on('object:moving', (e) => {
    moveAddPoints(e);
  });

  canvas.on('mouse:up', (e) => {
    pointMouseUpEvents(e);
  });

  canvas.on('mouse:out', (e) => {
    mouseOutEvents(e);
  });

  canvas.on('mouse:wheel', (e) => {
    shapeScrollEvents(e);
  });
}

export { assignAddPointsOnExistingPolygonEvents as default };
