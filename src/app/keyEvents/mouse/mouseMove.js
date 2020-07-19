let lastMouseMoveEvent = null;

function onMouseMoveEvent(event) {
  lastMouseMoveEvent = event;
}

function getLastMouseMoveEvent() {
  return lastMouseMoveEvent;
}

function registerMouseMoveEvents() {
  window.trackMouseMoveEvents = onMouseMoveEvent;
}

export { registerMouseMoveEvents, getLastMouseMoveEvent, onMouseMoveEvent };
