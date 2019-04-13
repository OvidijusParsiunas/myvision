import { pointMouseDownEvents, setAddPointsEventsCanvas, pointMouseUpEvents } from '../eventWorkers/addPointsEventsWorker';

function assignAddPointsOnExistingPolygonEvents(canvas) {
  setAddPointsEventsCanvas(canvas);

  canvas.on('mouse:down', (e) => {
    pointMouseDownEvents(e);
  });

  canvas.on('mouse:over', () => {

  });

  canvas.on('mouse:up', (e) => {
    pointMouseUpEvents(e);
  });

  canvas.on('mouse:out', () => {

  });
}

export { assignAddPointsOnExistingPolygonEvents as default };
