import fabric from 'fabric';
import setAddPointsMode from '../../cursorModes/addPointsMode';
import { removeEditedPolygonId } from './editPolygonEventsWorker';
import {
  removePolygonPoints, getPolygonEditingStatus, setPolygonEditingStatus,
  enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import polygonProperties from '../../../objects/polygon/properties';

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
let polygonPoints = [];

function displayInitialAddPolygonPoints(polygon) {
  if (getPolygonEditingStatus()) {
    removePolygonPoints(polygonPoints);
    polygonPoints = [];
  }
  canvas.discardActiveObject();
  let pointId = 0;
  polygon.get('points').forEach((point) => {
    const pointObj = new fabric.Circle(polygonProperties.initialAddPolygonPoint(pointId, point));
    canvas.add(pointObj);
    polygonPoints.push(pointObj);
    pointId += 1;
  });
  selectedPolygonId = polygon.id;
  setPolygonEditingStatus(true);
}

/* make sure to reuse this all */
// cancel not working after selecting add
// then deselecting and selecting again
// generates new points every time clicked on
// for all event types

function setPolygonNotEditableOnClick() {
  removePolygonPoints(polygonPoints);
  polygonPoints = [];
  selectedPolygonId = null;
}

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
    displayInitialAddPolygonPoints(event.target);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    setPolygonNotEditableOnClick();
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
