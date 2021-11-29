import {
  polygonMouseDownEvents, polygonMouseUpEvents, polygonMoveEvents,
  shapeMouseOutEvents, shapeMouseOverEvents, prepareCanvasForDefaultEvents,
  boundingBoxScalingEvents, shapeScrollEvents,
} from '../eventWorkers/defaultEventsWorker.js';

// not just for polygon
function assignDefaultEvents(canvas, polygonId, afterAddPoints) {
  prepareCanvasForDefaultEvents(canvas, polygonId, afterAddPoints);

  canvas.on('mouse:down', (e) => {
    polygonMouseDownEvents(e);
  });

  canvas.on('mouse:up', (e) => {
    polygonMouseUpEvents(e);
  });

  canvas.on('object:moving', (e) => {
    polygonMoveEvents(e);
  });

  canvas.on('object:scaling', (e) => {
    boundingBoxScalingEvents(e);
  });

  canvas.on('mouse:over', (e) => {
    shapeMouseOverEvents(e);
  });

  canvas.on('mouse:wheel', (e) => {
    shapeScrollEvents(e);
  });

  // edit this
  canvas.on('mouse:out', (e) => {
    if (e.target) {
      shapeMouseOutEvents(e);
    }
  });
}

export { assignDefaultEvents as default };
