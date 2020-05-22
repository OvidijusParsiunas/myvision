let lastMouseMoveEvent = null;

function onMouseMove(event) {
  lastMouseMoveEvent = event;
}

function getLastMouseMoveEvent() {
  return lastMouseMoveEvent;
}

function registerMouseMoveEvents() {
  window.trackMouseMoveEvents = onMouseMove;
}

export { registerMouseMoveEvents, getLastMouseMoveEvent };
