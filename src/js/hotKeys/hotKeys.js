import { labelShape, arrowKeyEvents as labellerModalArrowKeyEvents } from '../tools/labellerModal/buttonEventHandlers';
import { isEditingLabelInLabelList, escapeKeyEvent as labelListEscapeKeyEvents, arrowKeyEvents as labelListArrowKeyEvents } from '../tools/labelList/labelList';
import { closeModalViaKeyboard as closeUploadDatasetsModal } from '../tools/uploadDatasetsModal/views/viewManager';
import { closeModalViaKeyboard as closeMachineLearningModal } from '../tools/machineLearningModal/views/viewManager';
import {
  getExportDatasetsPopUpOpenState, getLabellerModalDisplayedState,
  getUploadDatasetsModalDisplayedState, getMachineLearningModalDisplayedState,
  getPolygonDrawingInProgressState, getBoundingBoxDrawingInProgressState,
  getAddingPolygonPointsState, getRemovingPolygonPointsState, getSettingsPopUpOpenState,
} from '../tools/stateMachine';

function arrowUpKeyHandler() {
  if (getLabellerModalDisplayedState()) {
    labellerModalArrowKeyEvents('ArrowUp');
  } else if (isEditingLabelInLabelList()) {
    labelListArrowKeyEvents('ArrowUp');
  }
}

function arrowDownKeyHandler() {
  if (getLabellerModalDisplayedState()) {
    labellerModalArrowKeyEvents('ArrowDown');
  } else if (isEditingLabelInLabelList()) {
    labelListArrowKeyEvents('ArrowDown');
  }
}

function deleteKeyHandler() {
  if (isEditingLabelInLabelList) labelListEscapeKeyEvents();
  window.removeShape();
}

function enterKeyHandler() {
  if (getLabellerModalDisplayedState()) {
    labelShape();
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
    labelListEscapeKeyEvents();
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
    default:
      break;
  }
  console.log(event.key);
}

function registerHotKeys() {
  document.addEventListener('keydown', keyDownEventHandler);
}

export { registerHotKeys as default };
