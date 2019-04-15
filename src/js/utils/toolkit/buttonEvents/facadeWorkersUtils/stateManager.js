let defaultState = false;
let alteringPolygonPointsState = false;

function getDefaultState() {
  return defaultState;
}

function getAlteringPolygonPointsState() {
  return alteringPolygonPointsState;
}

function setDefaultState(state) {
  defaultState = state;
}

function setAlteringPolygonPointsState(state) {
  alteringPolygonPointsState = state;
}

export {
  getDefaultState,
  setDefaultState,
  getAlteringPolygonPointsState,
  setAlteringPolygonPointsState,
};
