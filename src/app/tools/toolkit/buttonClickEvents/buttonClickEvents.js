import { removeButtonPopoverIfActive, doNothingIfNotLeftMouseButtonPressWthArg } from '../../utils/buttons/clickMiddleware';
import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick, settingsBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick, removePolygonPointBtnClick,
  exportDatasetsBtnClick, resetCanvasEventsToDefault, editShapesBtnClick,
  zoomBtnClick, machineLearningBtnClick, uploadDatasetsBtnClick,
} from './facade';
import {
  interruptAllCanvasEventsBeforeMultipleFunc, doNothingIfLabellingInProgress,
  doNothingIfLabellingOrAddingNewPoints, interruptNewShapeDrawingWthFunc1OrExecFunc2,
  interruptAllCanvasEventsBeforeFunc, func1IfDrawRemovePointsElseInterruptAllWthFunc2,
} from './eventMiddleware/buttonEventMiddleware';

function assignToolkitButtonEventHandlers() {
  window.editShapes = doNothingIfLabellingInProgress.bind(this, editShapesBtnClick);
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = func1IfDrawRemovePointsElseInterruptAllWthFunc2.bind(this,
    removePolygonPointBtnClick, createNewPolygonBtnClick);
  window.addPoints = doNothingIfLabellingOrAddingNewPoints.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.exportDatasets = removeButtonPopoverIfActive.bind(this, exportDatasetsBtnClick);
  window.uploadDatasets = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    [resetCanvasEventsToDefault, removeButtonPopoverIfActive, uploadDatasetsBtnClick]);
  window.displayMachineLearningModal = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    [resetCanvasEventsToDefault, removeButtonPopoverIfActive, machineLearningBtnClick]);
  window.removeShape = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveShapeBtnClick);
  window.zoom = doNothingIfNotLeftMouseButtonPressWthArg.bind(this, zoomBtnClick);
  window.displaySettingsPopup = removeButtonPopoverIfActive.bind(this, settingsBtnClick);
}

export { assignToolkitButtonEventHandlers as default };
