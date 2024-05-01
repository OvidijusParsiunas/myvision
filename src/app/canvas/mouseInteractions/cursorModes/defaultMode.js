// This function sets the default cursor for the given canvas.
// It sets the default cursor to 'default' and the hover cursor to 'move'
// if there are any movable objects in the canvas, and 'default' otherwise.
function setDefaultCanvasCursors(canvas) {
  canvas.defaultCursor = 'default';
  if (getMovableObjectsState()) {
    canvas.hoverCursor = 'move'; // If there are movable objects, set the hover cursor to 'move'
  } else {
    canvas.hoverCursor = 'default'; // Otherwise, set the hover cursor to 'default'

