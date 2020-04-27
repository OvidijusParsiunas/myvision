import {
  setEditablePolygon, removePolygonPoint, removePolygonPoints, getPolygonEditingStatus,
  getPolygonIdIfEditing, cleanPolygonPointsArray, changeExistingPolygonPointsToRemovable,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { removeEditedPolygonId } from './editPolygonEventsWorker';
import { highlightLabelInTheList, removeHighlightOfListLabel } from '../../../../tools/labelList/labelListHighlightUtils';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let removedPolygonPoints = false;
let selectedNothing = false;

function setRemovablePointsEventsCanvas(canvasObj) {
  changeExistingPolygonPointsToRemovable(canvasObj);
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
  if (selectedPolygonId !== null && selectedPolygonId !== undefined) {
    highlightLabelInTheList(selectedPolygonId);
  }
}

function prepareToEditPolygonPoints(event) {
  if (removedPolygonPoints) {
    cleanPolygonPointsArray();
    removedPolygonPoints = false;
  }
  removePolygonPoints();
  removeEditedPolygonId();
  setEditablePolygon(canvas, event.target, true);
  selectedPolygonId = event.target.id;
  highlightLabelInTheList(selectedPolygonId);
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedPolygonId = null;
  removeHighlightOfListLabel();
}

function pointMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'point') {
      removePolygonPoint(event.target.pointId, true);
      removedPolygonPoints = true;
    } else {
      if (event.target.shapeName === 'polygon') {
        newPolygonSelected = (event.target.id !== selectedPolygonId);
      }
      preventActiveObjectsAppearInFront(canvas);
    }
    selectedNothing = false;
  } else {
    selectedNothing = true;
  }
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point' && event.target.fill === 'red') {
    event.target.stroke = 'red';
    canvas.renderAll();
  }
}

function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && (selectedNothing || newPolygonSelected)) {
    // subset can be reused
    prepareToEditPolygonPoints(event);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    setPolygonNotEditableOnClick();
  }
}

function pointMouseOutEvents(event) {
  if (event.target && event.target.shapeName === 'point' && event.target.fill === 'red') {
    event.target.stroke = 'black';
    canvas.renderAll();
  }
}

export {
  pointMouseUpEvents, pointMouseOutEvents, setPolygonNotEditableOnClick,
  setRemovablePointsEventsCanvas, pointMouseOverEvents, pointMouseDownEvents,
};
