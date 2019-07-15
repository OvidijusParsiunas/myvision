let defaultState = false;
let removingPolygonPointsState = false;
let addingPolygonPointsState = false;
let movableObjectsState = true;
let continuousDrawingState = false;
let lastDrawingModeState = null;

function getDefaultState() {
  return defaultState;
}

function getAlteringPolygonPointsState() {
  return removingPolygonPointsState || addingPolygonPointsState;
}

function getRemovingPolygonPointsState() {
  return removingPolygonPointsState;
}

function getAddingPolygonPointsState() {
  return addingPolygonPointsState;
}

function getMovableObjectsState() {
  return movableObjectsState;
}

function getContinuousDrawingState() {
  return continuousDrawingState;
}

function getLastDrawingModeState() {
  return lastDrawingModeState;
}

function setDefaultState(state) {
  defaultState = state;
}

function setAlteringPolygonPointsState(state) {
  removingPolygonPointsState = state;
  addingPolygonPointsState = state;
}

function setRemovingPolygonPointsState(state) {
  removingPolygonPointsState = state;
}

function setAddingPolygonPointsState(state) {
  addingPolygonPointsState = state;
}

function setMovableObjectsState(state) {
  movableObjectsState = state;
}

function setContinuousDrawingState(state) {
  continuousDrawingState = state;
}

function setLastDrawingModeState(state) {
  lastDrawingModeState = state;
}
export {
  getDefaultState,
  setDefaultState,
  getMovableObjectsState,
  setMovableObjectsState,
  getLastDrawingModeState,
  setLastDrawingModeState,
  getContinuousDrawingState,
  setContinuousDrawingState,
  getAddingPolygonPointsState,
  setAddingPolygonPointsState,
  getAlteringPolygonPointsState,
  setAlteringPolygonPointsState,
  getRemovingPolygonPointsState,
  setRemovingPolygonPointsState,
};
