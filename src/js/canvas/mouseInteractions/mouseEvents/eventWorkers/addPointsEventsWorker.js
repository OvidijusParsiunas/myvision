import setAddPointsMode from '../../cursorModes/addPointsMode';
import { removeEditedPolygonId } from './editPolygonEventsWorker';
import { removePolygonPoints, getPolygonEditingStatus, setEditablePolygon } from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';


let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;

/* make sure to reuse this all */

// generates new points every time clicked on
// for all event types

// when clicking to remove polygon points, initial click moves the points

function setAddPointsEventsCanvas(canvasObj) {
  canvas = canvasObj;
}

function prepareToAddPolygonPoints(event) {
  if (!getPolygonEditingStatus()) {
    removeEditedPolygonId();
    setEditablePolygon(canvas, event.target, false, false, true);
    selectedPolygonId = event.target.id;
  }
}

function pointMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'point') {
      setAddPointsMode(canvas);
    } else {
      if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
        newPolygonSelected = true;
      } else {
        newPolygonSelected = false;
      }
      preventActiveObjectsAppearInFront(canvas);
    }
  }
}

function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && newPolygonSelected) {
    prepareToAddPolygonPoints(event);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    removePolygonPoints();
    selectedPolygonId = null;
  }
}

function getSelectedPolygonIdForAddPoints() {
  return selectedPolygonId;
}

export {
  pointMouseDownEvents,
  setAddPointsEventsCanvas,
  pointMouseUpEvents,
  getSelectedPolygonIdForAddPoints,
};
