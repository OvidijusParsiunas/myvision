let defaultState = false;
let removingPoints = false;

function getDefaultState() {
  return defaultState;
}

function getRemovingPointsState() {
  return removingPoints;
}

function setDefaultState(state) {
  defaultState = state;
}

function setRemovingPointsState(state) {
  removingPoints = state;
}

export {
  getDefaultState, getRemovingPointsState, setDefaultState, setRemovingPointsState,
};
