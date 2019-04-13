let defaultState = false;
let removingPoints = false;
let addingPoints = false;

function getDefaultState() {
  return defaultState;
}

function getRemovingPointsState() {
  return removingPoints;
}

function getAddingPointsState() {
  return addingPoints;
}

function setDefaultState(state) {
  defaultState = state;
}

function setRemovingPointsState(state) {
  removingPoints = state;
}

function setAddingPointsState(state) {
  addingPoints = state;
}

export {
  getDefaultState, getRemovingPointsState, getAddingPointsState,
  setDefaultState, setRemovingPointsState, setAddingPointsState,
};
