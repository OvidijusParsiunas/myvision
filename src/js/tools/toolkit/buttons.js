import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick,
  removePolygonPointBtnClick, downloadXMLBtnClick,
  uploadImageBtnClick, resetCanvasEventsToDefault,
  movableObjectsBtnClick, continuousDrawingBtnClick,
  toggleLabelsVisibilityBtnClick, zoomBtnClick, switchImageBtnClick,
} from './buttonEvents/facade';
import {
  interruptAllCanvasEventsBeforeFunc, interruptAllCanvasEventsBeforeFuncWInputs,
  doNothingIfLabellingInProgress, interruptNewShapeDrawingWthFunc1OrExecFunc2,
  doNothingIfLabellingOrAddingNewPoints, interruptAllCanvasEventsBeforeMultipleFunc,
  replaceExistingCanvas,
} from './buttonMiddleware/buttonMiddleware';
import { getSettingsPopUpOpenState, setSettingsPopUpOpenState } from './buttonEvents/facadeWorkersUtils/stateManager';

function offset(el) {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}


function assignToolkitButtonEvents() {
  window.createNewBndBox = interruptAllCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptAllCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.addPoints = doNothingIfLabellingOrAddingNewPoints.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.cancel = interruptAllCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.downloadXML = interruptAllCanvasEventsBeforeMultipleFunc.bind(this,
    resetCanvasEventsToDefault, downloadXMLBtnClick);
  window.uploadImage = interruptAllCanvasEventsBeforeFuncWInputs.bind(this, this,
    { uploadImageBtnClick, resetCanvasEventsToDefault });
  window.removeShape = interruptNewShapeDrawingWthFunc1OrExecFunc2.bind(this,
    resetCanvasEventsToDefault, removeActiveShapeBtnClick);
  window.movableObjects = movableObjectsBtnClick;
  window.continuousDrawing = continuousDrawingBtnClick;
  window.toggleLabelsVisibility = toggleLabelsVisibilityBtnClick;
  window.zoom = zoomBtnClick;
  window.switchImage = replaceExistingCanvas.bind(this, switchImageBtnClick,
    resetCanvasEventsToDefault);
  window.triggerImageUpload = () => { document.getElementById('fileid').click(); };
  window.displaySettingsPopup = () => {
    const settingsPopupElement = document.getElementById('settings-popup');
    const settingsButton = document.getElementById('settingsButton');
    if (!getSettingsPopUpOpenState()) {
      const divOffset = offset(settingsButton);
      settingsPopupElement.style.top = `${divOffset.top}px`;
      settingsPopupElement.style.left = '65px';
      settingsPopupElement.style.display = '';
      setSettingsPopUpOpenState(true);
    } else {
      settingsPopupElement.style.display = 'none';
      setSettingsPopUpOpenState(false);
    }
  };
  window.minimiseTextAndIcons = () => {
    const textElements = document.getElementsByClassName('tools-button-text');
    console.log(textElements);
    for (let i = 0; i < textElements.length; i += 1) {
      textElements[i].style.fontSize = '90%';
    }
    const iconElements = document.getElementsByClassName('tools-button-icon');
    console.log(iconElements);
    for (let i = 0; i < iconElements.length; i += 1) {
      iconElements[i].style.width = '30px';
    }
  };
}

export { assignToolkitButtonEvents as default };
