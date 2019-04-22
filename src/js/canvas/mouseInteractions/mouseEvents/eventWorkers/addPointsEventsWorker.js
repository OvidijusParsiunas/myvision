import fabric from 'fabric';
import setAddPointsMode from '../../cursorModes/addPointsMode';
import { removeEditedPolygonId } from './editPolygonEventsWorker';
import {
  removePolygonPoints, getPolygonEditingStatus, setEditablePolygon, getPolygonIdIfEditing,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import polygonProperties from '../../../objects/polygon/properties';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { changePolygonPointsToAddImpl } from '../../../objects/polygon/alterPolygon/changePointsStyle';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let addingPoints = false;
let initialCoordinates = [];
let activeLine = null;
const lineArray = [];
let initialMode = false;
let tempPointIndex = 0;

/* make sure to reuse this all */

// when adding point in initial mode, other objects should not be selectable

function setAddPointsEventsCanvas(canvasObj) {
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
}

function prepareToAddPolygonPoints(event) {
  removePolygonPoints();
  removeEditedPolygonId();
  setEditablePolygon(canvas, event.target, false, false, true);
  selectedPolygonId = event.target.id;
}

function drawLine(event) {
  if (addingPoints) {
    canvas.remove(activeLine);
    const pointer = canvas.getPointer(event.e);
    const points = [initialCoordinates.x, initialCoordinates.y, pointer.x, pointer.y];
    activeLine = new fabric.Line(points, polygonProperties.newLine);
    canvas.add(activeLine);
    canvas.renderAll();
  }
}

function pointMouseDownEvents(event) {
  if (!addingPoints) {
    if (event.target) {
      enableActiveObjectsAppearInFront(canvas);
      if (event.target.shapeName === 'point') {
        setAddPointsMode(canvas);
        event.target.set({ shapeName: 'initialAddPoint', radius: 3.5 });
        addingPoints = true;
        initialMode = true;
        initialCoordinates.x = event.target.left;
        initialCoordinates.y = event.target.top;
      } else {
        if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
          newPolygonSelected = true;
        } else {
          newPolygonSelected = false;
        }
        preventActiveObjectsAppearInFront(canvas);
      }
    }
  } else {
    if (initialMode) {
      changePolygonPointsToAddImpl(canvas);
      initialMode = false;
    }
    if (event.target && event.target.shapeName === 'point') {
      addingPoints = false;
    } else if (!event.target || (event.target && (event.target.shapeName !== 'initialAddPoint' && event.target.shapeName !== 'tempPoint'))) {
      // need to be selectable
      const pointer = canvas.getPointer(event.e);
      const point = new fabric.Circle(polygonProperties.newPoint(tempPointIndex, pointer));
      canvas.add(point);
      tempPointIndex += 1;
      initialCoordinates = pointer;
      lineArray.push(activeLine);
      activeLine = null;
    }
  }
}

function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && newPolygonSelected) {
    prepareToAddPolygonPoints(event);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    if (!addingPoints) {
      removePolygonPoints();
      selectedPolygonId = null;
    }
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
  drawLine,
};
