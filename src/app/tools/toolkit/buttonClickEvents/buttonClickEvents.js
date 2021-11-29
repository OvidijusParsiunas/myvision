import { removeButtonPopoverIfActive, doNothingIfNotLeftMouseButtonPressWthArg } from '../../utils/buttons/clickMiddleware.js';
import {
  removePolygonPointBtnClick, createNewPolygonBtnClick,
  zoomBtnClick, machineLearningBtnClick, uploadDatasetsBtnClick,
  resetCanvasEventsToDefault, editShapesBtnClick, settingsBtnClick,
  addPointsBtnClick, createNewBndBoxBtnClick, exportDatasetsBtnClick,
} from './facade.js';
import {
  func1IfDrawRemovePointsElseInterruptAllWthFunc2,
  doNothingIfLabellingOrAddingNewPoints, interruptAllCanvasEventsBeforeFunc,
  interruptAllCanvasEventsBeforeMultipleFunc, doNothingIfLabellingInProgress,
} from './eventMiddleware/buttonEventMiddleware.js';

function assignToolkitButtonClickEventHandlers() {
  window.editShapes = doNothingIfLabellingInProgress.bind(this, editShapesBtnClick);
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
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

export { assignToolkitButtonClickEventHandlers as default };
