// should be exported outside

let defaultState = false;
let removingPolygonPointsState = false;
let addingPolygonPointsState = false;
let movableObjectsState = true;
let continuousDrawingState = false;
let lastDrawingModeState = null;
let readyToDrawShapeState = false;
let hasDrawnShapeState = false;
let cancelledReadyToDrawState = null;
let removingPointsAfterCancelDrawState = null;
let labelsVisibilityState = true;
let editingLabelId = null;
let lastPolygonActionWasMoveState = false;
let newShapeSelectedViaLabelListState = false;
let currentZoomState = 1;
let doubleScrollCanvasState = false;
let settingsPopUpOpenState = false;
let exportDatasetsPopUpOpenState = false;
let changingMLGeneratedLabelNamesState = false;
let currentImageId = false;
let labellerModalDisplayed = false;
let boundingBoxScalingState = false;
let shapeMovingState = false;
let polygonDrawingInProgressState = false;

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

function getReadyToDrawShapeState() {
  return readyToDrawShapeState;
}

function getHasDrawnShapeState() {
  return hasDrawnShapeState;
}

function getCancelledReadyToDrawState() {
  return cancelledReadyToDrawState;
}

function getRemovingPointsAfterCancelDrawState() {
  return removingPointsAfterCancelDrawState;
}

function getLabelsVisibilityState() {
  return labelsVisibilityState;
}

function getEditingLabelId() {
  return editingLabelId;
}

function getLastPolygonActionWasMoveState() {
  return lastPolygonActionWasMoveState;
}

function getNewShapeSelectedViaLabelListState() {
  return newShapeSelectedViaLabelListState;
}

function getCurrentZoomState() {
  return currentZoomState;
}

function getDoubleScrollCanvasState() {
  return doubleScrollCanvasState;
}

function getSettingsPopUpOpenState() {
  return settingsPopUpOpenState;
}

function getExportDatasetsPopUpOpenState() {
  return exportDatasetsPopUpOpenState;
}

function getCurrentImageId() {
  return currentImageId;
}

function getChangingMLGeneratedLabelNamesState() {
  return changingMLGeneratedLabelNamesState;
}

function getLabellerModalDisplayedState() {
  return labellerModalDisplayed;
}

function getBoundingBoxScalingState() {
  return boundingBoxScalingState;
}

function getShapeMovingState() {
  return shapeMovingState;
}

function getPolygonDrawingInProgressState() {
  return polygonDrawingInProgressState;
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

function setReadyToDrawShapeState(state) {
  readyToDrawShapeState = state;
}

function setHasDrawnShapeState(state) {
  hasDrawnShapeState = state;
}

function setCancelledReadyToDrawState(state) {
  cancelledReadyToDrawState = state;
}

function setRemovingPointsAfterCancelDrawState(state) {
  removingPointsAfterCancelDrawState = state;
}

function setLabelsVisibilityState(state) {
  labelsVisibilityState = state;
}

function setEditingLabelId(state) {
  editingLabelId = state;
}

function setLastPolygonActionWasMoveState(state) {
  lastPolygonActionWasMoveState = state;
}

function setNewShapeSelectedViaLabelListState(state) {
  newShapeSelectedViaLabelListState = state;
}

function setCurrentZoomState(state) {
  currentZoomState = state;
}

function setDoubleScrollCanvasState(state) {
  doubleScrollCanvasState = state;
}

function setSettingsPopUpOpenState(state) {
  settingsPopUpOpenState = state;
}

function setExportDatasetsPopUpOpenState(state) {
  exportDatasetsPopUpOpenState = state;
}

function setCurrentImageId(id) {
  currentImageId = id;
}

function setChangingMLGeneratedLabelNamesState(state) {
  changingMLGeneratedLabelNamesState = state;
}

function setLabellerModalDisplayedState(state) {
  labellerModalDisplayed = state;
}

function setBoundingBoxScalingState(state) {
  boundingBoxScalingState = state;
}

function setShapeMovingState(state) {
  shapeMovingState = state;
}

function setPolygonDrawingInProgressState(state) {
  polygonDrawingInProgressState = state;
}

export {
  getDefaultState,
  setDefaultState,
  getCurrentImageId,
  setCurrentImageId,
  getEditingLabelId,
  setEditingLabelId,
  getShapeMovingState,
  setShapeMovingState,
  getCurrentZoomState,
  setCurrentZoomState,
  getHasDrawnShapeState,
  setHasDrawnShapeState,
  getMovableObjectsState,
  setMovableObjectsState,
  getLastDrawingModeState,
  setLastDrawingModeState,
  getReadyToDrawShapeState,
  setReadyToDrawShapeState,
  getLabelsVisibilityState,
  setLabelsVisibilityState,
  getSettingsPopUpOpenState,
  setSettingsPopUpOpenState,
  getContinuousDrawingState,
  setContinuousDrawingState,
  getBoundingBoxScalingState,
  setBoundingBoxScalingState,
  getDoubleScrollCanvasState,
  setDoubleScrollCanvasState,
  getAddingPolygonPointsState,
  setAddingPolygonPointsState,
  getCancelledReadyToDrawState,
  setCancelledReadyToDrawState,
  getAlteringPolygonPointsState,
  setAlteringPolygonPointsState,
  getRemovingPolygonPointsState,
  setRemovingPolygonPointsState,
  getLabellerModalDisplayedState,
  setLabellerModalDisplayedState,
  getExportDatasetsPopUpOpenState,
  setExportDatasetsPopUpOpenState,
  getLastPolygonActionWasMoveState,
  setLastPolygonActionWasMoveState,
  getPolygonDrawingInProgressState,
  setPolygonDrawingInProgressState,
  getNewShapeSelectedViaLabelListState,
  setNewShapeSelectedViaLabelListState,
  getRemovingPointsAfterCancelDrawState,
  setRemovingPointsAfterCancelDrawState,
  getChangingMLGeneratedLabelNamesState,
  setChangingMLGeneratedLabelNamesState,
};
