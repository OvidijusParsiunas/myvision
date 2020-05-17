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
import { addPointViaKeyboard, generatePolygonViaKeyboard } from '../canvas/objects/polygon/polygon';
import { instantiateNewBoundingBox, finishDrawingBoundingBox } from '../canvas/objects/boundingBox/boundingBox';
import { getCreatePolygonButtonState, getCreateBoundingBoxButtonState } from '../tools/toolkit/styling/stateMachine';

let canvas = null;
// only use this if w is going to exhibit the same behaviour
// let allowTheDrawingOfANewPolygon = true;

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
      addPointViaKeyboard();
    } else {
      // allowTheDrawingOfANewPolygon = false;
      window.createNewPolygon();
      removeFillForAllShapes();
      canvas.upperCanvasEl.dispatchEvent(new Event('mousemove'));
    }
  }
}

function wKeyHandler() {
  // doesn't work when shapes are deleted in continuous mode
  // check whether it still works when label options are closed in continuous mode
  // hodling the button and clicking the mouse
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

function wKeyUpHandler() {
  if (getBoundingBoxDrawingInProgressState()) {
    finishDrawingBoundingBox();
  }
}

function qKeyUpHandler() {
  // allowTheDrawingOfANewPolygon = true;
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
  } else if (getBoundingBoxDrawingInProgressState()) {
    window.createNewBndBox();
  } else if (getAddingPolygonPointsState()) {
    window.addPoints(document.getElementById('add-points-button'));
  } else if (getRemovingPolygonPointsState()) {
    window.removePoint(document.getElementById('remove-points-button'));
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
    case 'w':
      wKeyHandler();
      break;
    default:
      break;
  }
  console.log(event.key);
}

function keyUpEventHandler(event) {
  switch (event.key) {
    case 'q':
      qKeyUpHandler();
      break;
    case 'w':
      wKeyUpHandler();
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
