import { labelShape, arrowKeyEvents as labellerModalArrowKeyEvents } from '../../tools/labellerModal/buttonEventHandlers';
import {
  isEditingLabelInLabelList, cancelEditingViaKeyboard as cancelEditingLabelList,
  arrowKeyEventsForLabelOtionsList as labelOptionsListArrowKeyEvents,
  arrowKeyEventsForLabelList as labelListArrowKeyEvents,
} from '../../tools/labelList/labelList';
import { getCurrentlyHighlightedElement } from '../../tools/labelList/labelListHighlightUtils';
import { closeModalViaKeyboard as closeUploadDatasetsModal } from '../../tools/uploadDatasetsModal/views/viewManager';
import { closeModalViaKeyboard as closeMachineLearningModal } from '../../tools/machineLearningModal/views/viewManager';
import {
  getExportDatasetsPopUpOpenState, getLabellerModalDisplayedState,
  getPolygonDrawingInProgressState, getBoundingBoxDrawingInProgressState,
  getUploadDatasetsModalDisplayedState, getMachineLearningModalDisplayedState,
  getAddingPolygonPointsState, getRemovingPolygonPointsState, getSettingsPopUpOpenState,
  getShapeMovingState, getDefaultState, getLastDrawingModeState, getReadyToDrawShapeState,
} from '../../tools/stateMachine';
import { removeFillForAllShapes } from '../../canvas/objects/allShapes/allShapes';
import { addPointViaKeyboard as addPointToNewPolygonViaKeyboard, generatePolygonViaKeyboard } from '../../canvas/objects/polygon/polygon';
import { instantiateNewBoundingBox, finishDrawingBoundingBox } from '../../canvas/objects/boundingBox/boundingBox';
import {
  getEditShapesButtonState, getRemovePointsButtonState,
  getCreatePolygonButtonState, getCreateBoundingBoxButtonState, getAddPointsButtonState,
} from '../../tools/toolkit/styling/stateMachine';
import { removeTempPointViaKeyboard } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsOnNewPolygonEventsWorker';
import { removePointViaKeyboard } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';
import { addPointViaKeyboard as addPointToExistingPolygonViaKeyboard } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/addPointsEventsWorker';
import closePopUps from '../../tools/utils/closePopUps';
import { getUserOS } from '../../tools/OS/OSManager';

let canvas = null;
let isRKeyUp = true;
let isControlKeyDown = false;
let wKeyHandler = null;
let wKeyUpHandler = null;

function rKeyUpHandler() {
  isRKeyUp = true;
}

function controlKeyUpHandler() {
  isControlKeyDown = false;
}

function isModalOpen() {
  return getLabellerModalDisplayedState()
  || getUploadDatasetsModalDisplayedState()
  || getMachineLearningModalDisplayedState();
}

function qKeyHandler() {
  if (!isModalOpen() && !isEditingLabelInLabelList() && getCreatePolygonButtonState() !== 'disabled') {
    window.onmousedown();
    if (((getPolygonDrawingInProgressState() && !getRemovingPolygonPointsState())
    || (getReadyToDrawShapeState() && getLastDrawingModeState() === 'polygon'))) {
      addPointToNewPolygonViaKeyboard();
    } else {
      window.createNewPolygon();
      removeFillForAllShapes();
      canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
    }
  }
}

function eKeyHandler() {
  if (!isModalOpen() && !isEditingLabelInLabelList() && !getDefaultState() && getEditShapesButtonState() !== 'disabled') {
    closePopUps();
    window.editShapes();
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  }
}

// click w to starting drawing bounding box and clicking again to finish drawing it
function wKeyHandlerLinux() {
  if (!isModalOpen() && !isEditingLabelInLabelList()
    && getCreateBoundingBoxButtonState() !== 'disabled') {
    closePopUps();
    if (getBoundingBoxDrawingInProgressState()) {
      finishDrawingBoundingBox();
    } else if (getReadyToDrawShapeState() && getLastDrawingModeState() === 'boundingBox') {
      instantiateNewBoundingBox();
    } else {
      window.createNewBndBox();
      removeFillForAllShapes();
      canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
    }
  }
}

// click w and hold to draw bounding box and release to finish drawing it
function wKeyHandlerDefault() {
  if (!isModalOpen() && !isEditingLabelInLabelList()
        && getCreateBoundingBoxButtonState() !== 'disabled') {
    closePopUps();
    if (getBoundingBoxDrawingInProgressState()) return;
    if (getReadyToDrawShapeState() && getLastDrawingModeState() === 'boundingBox') {
      instantiateNewBoundingBox();
    } else {
      window.createNewBndBox();
      removeFillForAllShapes();
      canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
    }
  }
}

function wKeyUpHandlerDefault() {
  if (getBoundingBoxDrawingInProgressState()) {
    finishDrawingBoundingBox();
  }
}


function rKeyHandler() {
  if (!isModalOpen() && !isEditingLabelInLabelList() && !getShapeMovingState() && getRemovePointsButtonState() !== 'disabled') {
    closePopUps();
    if ((getPolygonDrawingInProgressState() && getRemovingPolygonPointsState())) {
      if (isRKeyUp) {
        removeTempPointViaKeyboard();
        isRKeyUp = false;
      }
    } else if (!getPolygonDrawingInProgressState() && getRemovingPolygonPointsState()) {
      if (isRKeyUp) {
        removePointViaKeyboard();
        isRKeyUp = false;
      }
    } else {
      window.removePoint(document.getElementById('remove-points-button'));
      removeFillForAllShapes();
      canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
    }
  }
}

function aKeyHandler() {
  // aware of when shape completed, not moving mouse, change to remove, but cannot remove
  // also if hovering point on edit, switched to remove, then add without move, can't add
  if (!isModalOpen() && !isEditingLabelInLabelList() && !getShapeMovingState() && getAddPointsButtonState() !== 'disabled') {
    closePopUps();
    if (getAddingPolygonPointsState()) {
      addPointToExistingPolygonViaKeyboard();
    } else {
      window.addPoints(document.getElementById('add-points-button'));
      removeFillForAllShapes();
      canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
    }
  }
}

function arrowUpKeyHandler() {
  const arrowUp = 'ArrowUp';
  if (getLabellerModalDisplayedState()) {
    labellerModalArrowKeyEvents(arrowUp);
  } else if (isEditingLabelInLabelList()) {
    labelOptionsListArrowKeyEvents(arrowUp);
  } else if (getCurrentlyHighlightedElement()) {
    labelListArrowKeyEvents(arrowUp);
  }
}

function arrowDownKeyHandler() {
  const arrowDown = 'ArrowDown';
  if (getLabellerModalDisplayedState()) {
    labellerModalArrowKeyEvents(arrowDown);
  } else if (isEditingLabelInLabelList()) {
    labelOptionsListArrowKeyEvents(arrowDown);
  } else if (getCurrentlyHighlightedElement()) {
    labelListArrowKeyEvents(arrowDown);
  }
}

function arrowLeftKeyHandler() {
  const arrowLeft = 'ArrowLeft';
  if (isControlKeyDown) {
    if (!isModalOpen() && !isEditingLabelInLabelList() && !getShapeMovingState()) {
      closePopUps();
      window.switchImage('previous');
    }
  } else if (!isEditingLabelInLabelList() && getCurrentlyHighlightedElement()) {
    labelListArrowKeyEvents(arrowLeft);
  }
}

function arrowRightKeyHandler() {
  const arrowRight = 'ArrowRight';
  if (isControlKeyDown) {
    if (!isModalOpen() && !isEditingLabelInLabelList() && !getShapeMovingState()) {
      closePopUps();
      window.switchImage('next');
    }
  } else if (!isEditingLabelInLabelList() && getCurrentlyHighlightedElement()) {
    labelListArrowKeyEvents(arrowRight);
  }
}

function removeKeyHandler() {
  if (isModalOpen() || isEditingLabelInLabelList()) return;
  closePopUps();
  window.removeShape();
  canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
}

function deleteKeyHandler() {
  removeKeyHandler();
}

function backspaceKeyHandler() {
  removeKeyHandler();
}

function controlKeyHandler() {
  isControlKeyDown = true;
}

function enterKeyHandler() {
  if (getLabellerModalDisplayedState()) {
    labelShape();
  } else if (getPolygonDrawingInProgressState() && !getRemovingPolygonPointsState()) {
    generatePolygonViaKeyboard();
  }
}

function escapeKeyHandler() {
  if (getExportDatasetsPopUpOpenState()) {
    window.exportDatasets();
  } else if (getSettingsPopUpOpenState()) {
    window.displaySettingsPopup();
  } else if (getLabellerModalDisplayedState()) {
    window.cancelLabellingProcess();
  } else if (getUploadDatasetsModalDisplayedState()) {
    closeUploadDatasetsModal();
  } else if (getMachineLearningModalDisplayedState()) {
    closeMachineLearningModal();
  } else if (getPolygonDrawingInProgressState()) {
    window.createNewPolygon();
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  } else if (getBoundingBoxDrawingInProgressState()) {
    window.createNewBndBox();
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  } else if (getAddingPolygonPointsState()) {
    window.addPoints(document.getElementById('add-points-button'));
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  } else if (getRemovingPolygonPointsState()) {
    window.removePoint(document.getElementById('remove-points-button'));
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  } else if (isEditingLabelInLabelList()) {
    cancelEditingLabelList();
  }
}

function keyDownEventHandler(event) {
  switch (event.key.toLowerCase()) {
    case 'escape':
      escapeKeyHandler();
      break;
    case 'enter':
      enterKeyHandler();
      break;
    case 'delete':
      deleteKeyHandler();
      break;
    case 'backspace':
      backspaceKeyHandler();
      break;
    case 'control':
      controlKeyHandler();
      break;
    case 'arrowup':
      arrowUpKeyHandler();
      break;
    case 'arrowdown':
      arrowDownKeyHandler();
      break;
    case 'arrowleft':
      arrowLeftKeyHandler();
      break;
    case 'arrowright':
      arrowRightKeyHandler();
      break;
    case 'q':
      qKeyHandler();
      break;
    case 'e':
      eKeyHandler();
      break;
    case 'w':
      wKeyHandler();
      break;
    case 'r':
      rKeyHandler();
      break;
    case 'a':
      aKeyHandler();
      break;
    default:
      break;
  }
}

function keyUpEventHandler(event) {
  switch (event.key.toLowerCase()) {
    case 'control':
      controlKeyUpHandler();
      break;
    case 'w':
      wKeyUpHandler();
      break;
    case 'r':
      rKeyUpHandler();
      break;
    default:
      break;
  }
}

function assignCanvasForHotKeys(canvasObj) {
  canvas = canvasObj;
}

function assignOSSpecificFunctionality() {
  if (getUserOS() === 'Linux') {
    wKeyHandler = wKeyHandlerLinux;
    wKeyUpHandler = () => {};
  } else {
    wKeyHandler = wKeyHandlerDefault;
    wKeyUpHandler = wKeyUpHandlerDefault;
  }
}

function registerHotKeys() {
  document.addEventListener('keydown', keyDownEventHandler);
  document.addEventListener('keyup', keyUpEventHandler);
  assignOSSpecificFunctionality();
}

export { registerHotKeys, assignCanvasForHotKeys };
