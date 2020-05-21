import { labelShape, arrowKeyEvents as labellerModalArrowKeyEvents } from '../tools/labellerModal/buttonEventHandlers';
import {
  isEditingLabelInLabelList, cancelEditingViaKeyboard as cancelEditingLabelList,
  arrowKeyEventsForLabelOtionsList as labelOptionsListArrowKeyEvents,
  arrowKeyEventsForLabelList as labelListArrowKeyEvents, finishEditingLabelList,
} from '../tools/labelList/labelList';
import { getCurrentlyHighlightedElement } from '../tools/labelList/labelListHighlightUtils';
import { closeModalViaKeyboard as closeUploadDatasetsModal } from '../tools/uploadDatasetsModal/views/viewManager';
import { closeModalViaKeyboard as closeMachineLearningModal } from '../tools/machineLearningModal/views/viewManager';
import {
  getExportDatasetsPopUpOpenState, getLabellerModalDisplayedState, getReadyToDrawShapeState,
  getUploadDatasetsModalDisplayedState, getMachineLearningModalDisplayedState,
  getPolygonDrawingInProgressState, getBoundingBoxDrawingInProgressState, getLastDrawingModeState,
  getAddingPolygonPointsState, getRemovingPolygonPointsState, getSettingsPopUpOpenState,
} from '../tools/stateMachine';
import { removeFillForAllShapes } from '../canvas/objects/allShapes/allShapes';
import { addPointViaKeyboard as addPointToNewPolygonViaKeyboard, generatePolygonViaKeyboard } from '../canvas/objects/polygon/polygon';
import { instantiateNewBoundingBox, finishDrawingBoundingBox } from '../canvas/objects/boundingBox/boundingBox';
import {
  getEditShapesButtonState, getRemovePointsButtonState,
  getCreatePolygonButtonState, getCreateBoundingBoxButtonState, getAddPointsButtonState,
} from '../tools/toolkit/styling/stateMachine';
import { removeTempPointViaKeyboard } from '../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsOnNewPolygonEventsWorker';
import { removePointViaKeyboard } from '../canvas/mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';
import { addPointViaKeyboard as addPointToExistingPolygonViaKeyboard } from '../canvas/mouseInteractions/mouseEvents/eventWorkers/addPointsEventsWorker';

let canvas = null;
let rKeyUp = true;

function isModalOpen() {
  return getLabellerModalDisplayedState()
  || getUploadDatasetsModalDisplayedState()
  || getMachineLearningModalDisplayedState();
}

function qKeyHandler() {
  if (!isModalOpen() && !isEditingLabelInLabelList() && getCreatePolygonButtonState() !== 'disabled') {
    finishEditingLabelList();
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
  // do not remove fills when clicking edit when already within edit mode
  if (!isModalOpen() && !isEditingLabelInLabelList() && getEditShapesButtonState() !== 'disabled') {
    finishEditingLabelList();
    window.editShapes();
    canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
  }
}

function wKeyHandler() {
  if (!isModalOpen() && !isEditingLabelInLabelList() && getCreateBoundingBoxButtonState() !== 'disabled') {
    finishEditingLabelList();
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

// for clicking to starting drawing bounding box and clicing to finsih drawing it
// function wKeyHandler() {
//   if (!isModalOpen() && !isEditingLabelInLabelList()
//     && getCreateBoundingBoxButtonState() !== 'disabled') {
//     finishEditingLabelList();
//     if (getBoundingBoxDrawingInProgressState()) {
//       finishDrawingBoundingBox();
//     } else if (getReadyToDrawShapeState() && getLastDrawingModeState() === 'boundingBox') {
//       instantiateNewBoundingBox();
//     } else {
//       window.createNewBndBox();
//       canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
//     }
//   }
// }

function rKeyHandler() {
  // try to find a way to add new point, click r and remove without moving mouse
  if (!isModalOpen() && !isEditingLabelInLabelList() && getRemovePointsButtonState() !== 'disabled') {
    finishEditingLabelList();
    if ((getPolygonDrawingInProgressState() && getRemovingPolygonPointsState())) {
      if (rKeyUp) {
        removeTempPointViaKeyboard();
        rKeyUp = false;
      }
    } else if (!getPolygonDrawingInProgressState() && getRemovingPolygonPointsState()) {
      if (rKeyUp) {
        removePointViaKeyboard();
        rKeyUp = false;
      }
    } else {
      window.removePoint(document.getElementById('remove-points-button'));
      removeFillForAllShapes();
      canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
    }
  }
}

function aKeyHandler() {
  // !! see if it works if clicking a and mouse !!
  // try to select a polygon and mess around with the keys to see if modes and buttons change
  // aware of when shape completed, not moving mouse, change to remove, but cannot remove
  // also if hovering point on edit, switched to remove, then add without move, can't add
  if (!isModalOpen() && !isEditingLabelInLabelList() && getAddPointsButtonState() !== 'disabled') {
    finishEditingLabelList();
    if (getAddingPolygonPointsState()) {
      addPointToExistingPolygonViaKeyboard();
    } else {
      window.addPoints(document.getElementById('add-points-button'));
      removeFillForAllShapes();
      canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
    }
  }
}

function wKeyUpHandler() {
  if (getBoundingBoxDrawingInProgressState()) {
    finishDrawingBoundingBox();
  }
}

function rKeyUpHandler() {
  rKeyUp = true;
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
  if (!isEditingLabelInLabelList() && getCurrentlyHighlightedElement()) {
    labelListArrowKeyEvents(arrowLeft);
  }
}

function arrowRightKeyHandler() {
  const arrowRight = 'ArrowRight';
  if (!isEditingLabelInLabelList() && getCurrentlyHighlightedElement()) {
    labelListArrowKeyEvents(arrowRight);
  }
}

function deleteKeyHandler() {
  if (isEditingLabelInLabelList()) cancelEditingLabelList();
  window.removeShape();
  canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
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
  switch (event.key) {
    case 'Escape':
      escapeKeyHandler();
      break;
    case 'Enter':
      enterKeyHandler();
      break;
    case 'Delete':
      deleteKeyHandler();
      break;
    case 'ArrowUp':
      arrowUpKeyHandler();
      break;
    case 'ArrowDown':
      arrowDownKeyHandler();
      break;
    case 'ArrowLeft':
      arrowLeftKeyHandler();
      break;
    case 'ArrowRight':
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
  switch (event.key) {
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

function registerHotKeys() {
  document.addEventListener('keydown', keyDownEventHandler);
  document.addEventListener('keyup', keyUpEventHandler);
}

export { registerHotKeys, assignCanvasForHotKeys };
