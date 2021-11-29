import { labelShape, arrowKeyEvents as labellerModalArrowKeyEvents } from '../../tools/labellerModal/buttonEventHandlers.js';
import {
  isEditingLabelInLabelList, cancelEditingViaKeyboard as cancelEditingLabelList,
  arrowKeyEventsForLabelOtionsList as labelOptionsListArrowKeyEvents,
  arrowKeyEventsForLabelList as labelListArrowKeyEvents,
} from '../../tools/labelList/labelList.js';
import { getCurrentlyHighlightedElement } from '../../tools/labelList/labelListHighlightUtils.js';
import { closeModalViaKeyboard as closeUploadDatasetsModal } from '../../tools/uploadDatasetsModal/views/viewManager.js';
import { closeModalViaKeyboard as closeMachineLearningModal } from '../../tools/machineLearningModal/views/viewManager.js';
import {
  getShapeMovingState, getDefaultState, getLastDrawingModeState,
  getExportDatasetsPopupOpenState, getLabellerModalDisplayedState,
  getPolygonDrawingInProgressState, getBoundingBoxDrawingInProgressState,
  getUploadDatasetsModalDisplayedState, getMachineLearningModalDisplayedState,
  getAddingPolygonPointsState, getRemovingPolygonPointsState, getSettingsPopupOpenState,
  getRemoveImageModalDisplayedState, getReadyToDrawShapeState, getWelcomeModalDisplayedState,
} from '../../tools/state.js';
import { removeFillForAllShapes } from '../../canvas/objects/allShapes/allShapes.js';
import { addPointViaKeyboard as addPointToNewPolygonViaKeyboard, generatePolygonViaKeyboard } from '../../canvas/objects/polygon/polygon.js';
import { instantiateNewBoundingBox, finishDrawingBoundingBox } from '../../canvas/objects/boundingBox/boundingBox.js';
import {
  getCreatePolygonButtonState, getCreateBoundingBoxButtonState,
  getEditShapesButtonState, getRemovePointsButtonState, getAddPointsButtonState,
} from '../../tools/toolkit/styling/state.js';
import { closeRemoveImagesModal } from '../../tools/imageList/removeImages/modal/style.js';
import { removeTempPointViaKeyboard } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsOnNewPolygonEventsWorker.js';
import { removePointViaKeyboard } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker.js';
import { addPointViaKeyboard as addPointToExistingPolygonViaKeyboard } from '../../canvas/mouseInteractions/mouseEvents/eventWorkers/addPointsEventsWorker.js';
import closeAllPopups from '../../tools/utils/popups/closeAllPopups.js';
import { getUserOS } from '../../tools/OS/OSManager.js';
import { closeWelcomeModal } from '../../tools/welcomeModal/buttons/workers.js';
import isAnyModalOpen from '../../tools/utils/modals/status.js';

let canvas = null;
let isRKeyUp = true;
let wKeyHandler = null;
let wKeyUpHandler = null;

function rKeyUpHandler() {
  isRKeyUp = true;
}

function qKeyHandler() {
  if (!isAnyModalOpen() && !isEditingLabelInLabelList() && getCreatePolygonButtonState() !== 'disabled') {
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
  if (!isAnyModalOpen() && !isEditingLabelInLabelList() && !getDefaultState() && getEditShapesButtonState() !== 'disabled') {
    closeAllPopups();
    window.editShapes();
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  }
}

// click w to starting drawing bounding box and clicking again to finish drawing it
function wKeyHandlerLinux() {
  if (!isAnyModalOpen() && !isEditingLabelInLabelList()
    && getCreateBoundingBoxButtonState() !== 'disabled') {
    closeAllPopups();
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
  if (!isAnyModalOpen() && !isEditingLabelInLabelList()
        && getCreateBoundingBoxButtonState() !== 'disabled') {
    closeAllPopups();
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
  if (!isAnyModalOpen() && !isEditingLabelInLabelList() && !getShapeMovingState() && getRemovePointsButtonState() !== 'disabled') {
    closeAllPopups();
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
  if (!isAnyModalOpen() && !isEditingLabelInLabelList() && !getShapeMovingState() && getAddPointsButtonState() !== 'disabled') {
    closeAllPopups();
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
  if (!isAnyModalOpen() && !isEditingLabelInLabelList() && !getShapeMovingState()) {
    closeAllPopups();
    window.switchImage('previous');
  }
}

function arrowRightKeyHandler() {
  if (!isAnyModalOpen() && !isEditingLabelInLabelList() && !getShapeMovingState()) {
    closeAllPopups();
    window.switchImage('next');
  }
}

function removeKeyHandler() {
  if (isAnyModalOpen() || isEditingLabelInLabelList()) return;
  closeAllPopups();
  window.removeLabel();
  canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
}

function deleteKeyHandler() {
  removeKeyHandler();
}

function backspaceKeyHandler() {
  removeKeyHandler();
}

function enterKeyHandler() {
  if (getLabellerModalDisplayedState()) {
    labelShape();
  } else if (getRemoveImageModalDisplayedState()) {
    window.approveRemoveImage();
  } else if (getWelcomeModalDisplayedState()) {
    closeWelcomeModal();
  } else if (getPolygonDrawingInProgressState() && !getRemovingPolygonPointsState()) {
    generatePolygonViaKeyboard();
  }
}

function escapeKeyHandler() {
  if (getExportDatasetsPopupOpenState()) {
    window.toggleExportDatasetsPopup();
  } else if (getSettingsPopupOpenState()) {
    window.toggleSettingsPopup();
  } else if (getLabellerModalDisplayedState()) {
    window.cancelLabellingProcess();
  } else if (getUploadDatasetsModalDisplayedState()) {
    closeUploadDatasetsModal();
  } else if (getMachineLearningModalDisplayedState()) {
    closeMachineLearningModal();
  } else if (getRemoveImageModalDisplayedState()) {
    closeRemoveImagesModal();
  } else if (getWelcomeModalDisplayedState()) {
    closeWelcomeModal();
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
