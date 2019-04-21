import {
  pointMouseDownEvents, setAddPointsEventsCanvas, pointMouseUpEvents, drawLine,
} from '../eventWorkers/addPointsEventsWorker';

function assignAddPointsOnExistingPolygonEvents(canvas) {
  setAddPointsEventsCanvas(canvas);

  canvas.on('mouse:down', (e) => {
    pointMouseDownEvents(e);
  });

  canvas.on('mouse:over', () => {

  });

  canvas.on('mouse:move', (e) => {
    drawLine(e);
  });

  canvas.on('mouse:up', (e) => {
    pointMouseUpEvents(e);
  });

  canvas.on('mouse:out', () => {

  });
}

export { assignAddPointsOnExistingPolygonEvents as default };
