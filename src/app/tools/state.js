let defaultState = false;
let removingPolygonPointsState = false;
let addingPolygonPointsState = false;
let movableObjectsState = true;
let continuousDrawingState = true;
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
let settingsPopupOpenState = false;
let exportDatasetsPopupOpenState = false;
let changingMLGeneratedLabelNamesState = false;
let currentImageId = false;
let labellerModalDisplayed = false;
let uploadDatasetsModalDisplayedState = false;
let machineLearningModalDisplayedState = false;
let hasMachineLearningButtonBeenHighligted = false;
let boundingBoxScalingState = false;
let shapeMovingState = false;
let polygonDrawingInProgressState = false;
let boundingBoxDrawingInProgressState = false;
let removeImageModalDisplayedState = false;
let welcomeModalDisplayedState = false;
let sessionDirty = false;
let crosshairForBoundingBoxVisibleState = true;
let crosshairUsedOnCanvasState = false;
let boundingBoxCrosshairDropdownOpenState = false;

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

function getSettingsPopupOpenState() {
  return settingsPopupOpenState;
}

function getExportDatasetsPopupOpenState() {
  return exportDatasetsPopupOpenState;
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

function getBoundingBoxDrawingInProgressState() {
  return boundingBoxDrawingInProgressState;
}

function getUploadDatasetsModalDisplayedState() {
  return uploadDatasetsModalDisplayedState;
}

function getMachineLearningModalDisplayedState() {
  return machineLearningModalDisplayedState;
}

function getRemoveImageModalDisplayedState() {
  return removeImageModalDisplayedState;
}

function getWelcomeModalDisplayedState() {
  return welcomeModalDisplayedState;
}

function getSessionDirtyState() {
  return sessionDirty;
}

function getHasMachineLearningButtonBeenHighligtedState() {
  return hasMachineLearningButtonBeenHighligted;
}

function getCrosshairForBoundingBoxVisibleState() {
  return crosshairForBoundingBoxVisibleState;
}

function getCrosshairUsedOnCanvasState() {
  return crosshairUsedOnCanvasState;
}

function getBoundingBoxCrosshairDropdownOpenState() {
  return boundingBoxCrosshairDropdownOpenState;
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

function setSettingsPopupOpenState(state) {
  settingsPopupOpenState = state;
}

function setExportDatasetsPopupOpenState(state) {
  exportDatasetsPopupOpenState = state;
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

function setBoundingBoxDrawingInProgressState(state) {
  boundingBoxDrawingInProgressState = state;
}

function setUploadDatasetsModalDisplayedState(state) {
  uploadDatasetsModalDisplayedState = state;
}

function setMachineLearningModalDisplayedState(state) {
  machineLearningModalDisplayedState = state;
}

function setRemoveImageModalDisplayedState(state) {
  removeImageModalDisplayedState = state;
}

function setWelcomeModalDisplayedState(state) {
  welcomeModalDisplayedState = state;
}

function setSessionDirtyState(state) {
  sessionDirty = state;
}

function setHasMachineLearningButtonBeenHighligtedState(state) {
  hasMachineLearningButtonBeenHighligted = state;
}

function setCrosshairForBoundingBoxVisibleState(state) {
  crosshairForBoundingBoxVisibleState = state;
}

function setCrosshairUsedOnCanvasState(state) {
  crosshairUsedOnCanvasState = state;
}

function setBoundingBoxCrosshairDropdownOpenState(state) {
  boundingBoxCrosshairDropdownOpenState = state;
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
  getSessionDirtyState,
  setSessionDirtyState,
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
  getSettingsPopupOpenState,
  setSettingsPopupOpenState,
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
  getCrosshairUsedOnCanvasState,
  setCrosshairUsedOnCanvasState,
  getWelcomeModalDisplayedState,
  setWelcomeModalDisplayedState,
  getAlteringPolygonPointsState,
  setAlteringPolygonPointsState,
  getRemovingPolygonPointsState,
  setRemovingPolygonPointsState,
  getLabellerModalDisplayedState,
  setLabellerModalDisplayedState,
  getExportDatasetsPopupOpenState,
  setExportDatasetsPopupOpenState,
  getLastPolygonActionWasMoveState,
  setLastPolygonActionWasMoveState,
  getPolygonDrawingInProgressState,
  setPolygonDrawingInProgressState,
  getRemoveImageModalDisplayedState,
  setRemoveImageModalDisplayedState,
  getUploadDatasetsModalDisplayedState,
  setUploadDatasetsModalDisplayedState,
  getNewShapeSelectedViaLabelListState,
  setNewShapeSelectedViaLabelListState,
  getBoundingBoxDrawingInProgressState,
  setBoundingBoxDrawingInProgressState,
  getMachineLearningModalDisplayedState,
  setMachineLearningModalDisplayedState,
  getRemovingPointsAfterCancelDrawState,
  setRemovingPointsAfterCancelDrawState,
  getChangingMLGeneratedLabelNamesState,
  setChangingMLGeneratedLabelNamesState,
  getCrosshairForBoundingBoxVisibleState,
  setCrosshairForBoundingBoxVisibleState,
  getBoundingBoxCrosshairDropdownOpenState,
  setBoundingBoxCrosshairDropdownOpenState,
  getHasMachineLearningButtonBeenHighligtedState,
  setHasMachineLearningButtonBeenHighligtedState,
};
