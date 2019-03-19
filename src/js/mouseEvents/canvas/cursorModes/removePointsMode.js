import { setRemovePointsEventsObjectsProperties } from '../events/eventsManagers/removePointsEventsManager';

function setRemovePointsMode(canvas) {
  setRemovePointsEventsObjectsProperties();
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  canvas.renderAll();
}

export { setRemovePointsMode as default };
