import {
  pointMouseDownEvents, pointMouseOverEvents,
  pointMouseUpEvents, pointMouseOutEvents,
  setRemovablePointsEventsCanvas,
} from '../eventWorkers/removePointsOnNewPolygonEventsWorker';
import {
  getTempPolygon,
} from '../../../objects/polygon/polygon';

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
}

export { assignRemovePointsOnDrawPolygonEvents as default };
