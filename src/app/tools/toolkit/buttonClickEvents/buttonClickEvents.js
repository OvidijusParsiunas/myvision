import { removeButtonPopoverIfActive, doNothingIfNotLeftMouseButtonPressWthArg } from '../../utils/buttons/clickMiddleware';
import {
  zoomBtnClick, machineLearningBtnClick, uploadDatasetsBtnClick,
  resetCanvasEventsToDefault, editShapesBtnClick, settingsBtnClick,
  addPointsBtnClick, createNewBndBoxBtnClick, exportDatasetsBtnClick,
  removePolygonPointBtnClick, createNewPolygonBtnClick, crosshairBtnClick,
} from './facade';
import {
  func1IfDrawRemovePointsElseInterruptAllWthFunc2,
  doNothingIfLabellingOrAddingNewPoints, interruptAllCanvasEventsBeforeFunc,
  interruptAllCanvasEventsBeforeMultipleFunc, doNothingIfLabellingInProgress,
} from './eventMiddleware/buttonEventMiddleware';

function assignToolkitButtonEventHandlers() {
  window.editShapes = doNothingIfLabellingInProgress.bind(this, editShapesBtnClick);
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.toggleCrosshair = doNothingIfNotLeftMouseButtonPressWthArg.bind(this, crosshairBtnClick);
  window.createNewPolygon = func1IfDrawRemovePointsElseInterruptAllWthFunc2.bind(this,
    removePolygonPointBtnClick, createNewPolygonBtnClick);
  window.addPoints = doNothingIfLabellingOrAddingNewPoints.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.toggleExportDatasetsPopup = removeButtonPopoverIfActive.bind(this, exportDatasetsBtnClick);
  window.uploadDatasets = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    [resetCanvasEventsToDefault, removeButtonPopoverIfActive, uploadDatasetsBtnClick]);
  window.displayMachineLearningModal = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    [resetCanvasEventsToDefault, removeButtonPopoverIfActive, machineLearningBtnClick]);
  window.zoom = doNothingIfNotLeftMouseButtonPressWthArg.bind(this, zoomBtnClick);
  window.toggleSettingsPopup = removeButtonPopoverIfActive.bind(this, settingsBtnClick);
}

export { assignToolkitButtonEventHandlers as default };
