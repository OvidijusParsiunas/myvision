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
import { addPointViaKeyboard, generatePolygonViaKeyboard } from '../canvas/objects/polygon/polygon';
import { getCreatePolygonButtonState } from '../tools/toolkit/styling/stateMachine';

function isModalOpen() {
  return getLabellerModalDisplayedState()
  || getUploadDatasetsModalDisplayedState()
  || getMachineLearningModalDisplayedState();
}

function qKeyHandler() {
  // make sure to automatically refresh the mouse when q is clicked to prepare drawing a new polygon
  if (!isModalOpen() && !isEditingLabelInLabelList() && getCreatePolygonButtonState() !== 'disabled') {
    finishEditingLabelList();
    if ((getPolygonDrawingInProgressState() && !getRemovingPolygonPointsState())
    || (getReadyToDrawShapeState() && getLastDrawingModeState() === 'polygon')) {
      addPointViaKeyboard();
    } else {
      window.createNewPolygon();
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
      qKeyHandler(event);
      break;
    default:
      break;
  }
  console.log(event.key);
}

function registerHotKeys() {
  document.addEventListener('keydown', keyDownEventHandler);
}

export { registerHotKeys as default };
