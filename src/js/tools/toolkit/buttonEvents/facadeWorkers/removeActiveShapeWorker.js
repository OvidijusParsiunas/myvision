import {
  removePolygon, clearAllAddPointsData, isAddingPointsToPolygon, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import {
  resetNewPolygonData, isPolygonDrawingInProgress, isPolygonDrawingFinished, resetDrawPolygonMode,
} from '../../../../canvas/objects/polygon/polygon';
import { clearBoundingBoxData, isBoundingBoxDrawingFinished, resetDrawBoundingBoxMode } from '../../../../canvas/objects/boundingBox/boundingBox';
import { removeEditedPolygonId } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import { getAddingPolygonPointsState, getContinuousDrawingState } from '../facadeWorkersUtils/stateManager';
import { isLabelling, removeTargetShape } from '../../../labellerPopUp/labellingProcess';
import { hideLabelPopUp } from '../../../labellerPopUp/style';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';

function removeBoundingBox(canvas) {
  const activeObect = canvas.getActiveObject();
  if (activeObect && activeObect.shapeName === 'bndBox') {
    canvas.remove(activeObect);
    return true;
  }
  return false;
}

function isCurrentlyDrawing(canvas) {
  if (getContinuousDrawingState()) {
    if (isLabelling()) {
      if (isPolygonDrawingFinished()) {
        hideLabelPopUp();
        removeTargetShape();
        resetDrawPolygonMode();
      } else if (isBoundingBoxDrawingFinished()) {
        hideLabelPopUp();
        removeTargetShape();
        resetDrawBoundingBoxMode();
      }
    } else if (isPolygonDrawingInProgress()) {
      purgeCanvasMouseEvents(canvas);
      assignDrawPolygonEvents(canvas);
    }
    return true;
  }
  return false;
}

function removeActiveShapeEvent(canvas) {
  if (!isCurrentlyDrawing(canvas) || !removeBoundingBox(canvas)) {
    if (isAddingPointsToPolygon()) {
      purgeCanvasMouseEvents(canvas);
      assignAddPointsOnExistingPolygonEvents(canvas);
      clearAllAddPointsData();
      setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
    } else if (getAddingPolygonPointsState()) {
      clearAllAddPointsData();
    }
    removePolygon();
    removePolygonPoints();
    resetNewPolygonData();
    clearBoundingBoxData();
    removeEditedPolygonId();
  }
}

export { removeActiveShapeEvent as default };
