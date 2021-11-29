import {
  pointMouseUpEvents, pointMouseOutEvents,
  pointMouseDownEvents, pointMouseOverEvents,
  setRemovablePointsEventsCanvas, pointMouseMoveEvents,
} from '../eventWorkers/removePointsOnNewPolygonEventsWorker.js';
import {
  getTempPolygon,
} from '../../../objects/polygon/polygon.js';

function assignRemovePointsOnDrawPolygonEvents(canvas) {
  setRemovablePointsEventsCanvas(canvas, getTempPolygon());

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

  canvas.on('mouse:move', (e) => {
    pointMouseMoveEvents(e);
  });
}

export { assignRemovePointsOnDrawPolygonEvents as default };
