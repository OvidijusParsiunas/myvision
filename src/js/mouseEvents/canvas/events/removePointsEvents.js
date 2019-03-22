import {
  pointMouseDownEvents, pointMouseOverEvents,
  pointMouseUpEvents, pointMouseOutEvents,
  setRemovablePointsEventsCanvas,
} from './eventsManagers/removePointsOnNewPolygonEventsManager';
import {
  getTempPolygon,
} from '../../../canvas/canvasObjects/polygon/polygon';
// changed

function assignRemovePointsEvents(canvas) {
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

export { assignRemovePointsEvents as default };
