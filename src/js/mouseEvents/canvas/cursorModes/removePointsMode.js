// import {} from '../events/eventsManagers/removePointsOnNewPolygonEventsManager';
// changed

function setRemovePointsMode(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  canvas.renderAll();
}

export { setRemovePointsMode as default };
