import setAddPointsMode from '../../cursorModes/addPointsMode';
import { removeEditedPolygonId } from './editPolygonEventsWorker';
import {
  removePolygonPoints, getPolygonEditingStatus,
  enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront,
  displayInitialAddPolygonPoints,
} from '../../../objects/polygon/alterPolygon/alterPolygon';

// import {
//   // setEditablePolygon,
//   removePolygonPoint,
//   // removePolygonPoints,
//   // getPolygonEditingStatus,
// } from '../../../objects/polygon/alterPolygon/alterPolygon';
// import { removeEditedPolygonId } from './editPolygonEventsWorker';


let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;

// consider extending functionality
// to multiple files in the
// alterPolygon folder

/* make sure to reuse this all */

// generates new points every time clicked on
// for all event types

function setAddPointsEventsCanvas(canvasObj) {
  canvas = canvasObj;
}

function pointMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront();
    if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
      newPolygonSelected = true;
    } else if (event.target.shapeName === 'point') {
      setAddPointsMode(canvas);
    } else {
      preventActiveObjectsAppearInFront();
      newPolygonSelected = false;
    }
  }
}

function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && newPolygonSelected) {
    // subset can be reused
    removeEditedPolygonId();
    selectedPolygonId = displayInitialAddPolygonPoints(canvas, event.target);
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
