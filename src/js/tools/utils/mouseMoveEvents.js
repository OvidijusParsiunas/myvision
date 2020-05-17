let lastMouseMoveEvent = null;

function getLastMouseMoveEvent() {
  return lastMouseMoveEvent;
}

window.trackMouseMoveEvents = (event) => {
  lastMouseMoveEvent = event;
};

export { getLastMouseMoveEvent as default };
