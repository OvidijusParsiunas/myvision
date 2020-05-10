import { labelShape } from '../tools/labellerModal/buttonEventHandlers';
import {
  getExportDatasetsPopUpOpenState, getLabellerModalDisplayedState,
  getPolygonDrawingInProgressState, getBoundingBoxDrawingInProgressState,
  getAddingPolygonPointsState, getRemovingPolygonPointsState, getSettingsPopUpOpenState,
} from '../tools/stateMachine';

function deleteKey() {
  window.removeShape();
}

function enterKey() {
  if (getLabellerModalDisplayedState()) {
    labelShape();
  }
}

function escapeKey() {
  if (getExportDatasetsPopUpOpenState()) {
    window.exportDatasets();
  } else if (getSettingsPopUpOpenState()) {
    window.displaySettingsPopup();
  } else if (getLabellerModalDisplayedState()) {
    window.cancelLabellingProcess();
  } else if (getPolygonDrawingInProgressState()) {
    window.createNewPolygon();
  } else if (getBoundingBoxDrawingInProgressState()) {
    window.createNewBndBox();
  } else if (getAddingPolygonPointsState()) {
    window.addPoints(document.getElementById('add-points-button'));
  } else if (getRemovingPolygonPointsState()) {
    window.removePoint(document.getElementById('remove-points-button'));
  }
}

function keyDownEventHandler(event) {
  switch (event.key) {
    case 'Escape':
      escapeKey();
      break;
    case 'Enter':
      enterKey();
      break;
    case 'Delete':
      deleteKey();
      break;
    default:
      break;
  }
  console.log(event.key);
}

function registerKeyInterceptor() {
  document.addEventListener('keydown', keyDownEventHandler);
}

export { registerKeyInterceptor as default };
