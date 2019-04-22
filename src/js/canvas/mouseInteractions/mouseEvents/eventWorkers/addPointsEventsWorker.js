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
let activeLine = null;
const lineArray = [];
let initialMode = false;
let tempPointIndex = 0;
let activeFunction = null;

/* make sure to reuse this all */

// when adding point in initial mode, other objects should not be selectable

function initialMouseOverEventsPlaceHolderFunction() {}

function addingNewPointsFunction(events) {
  if (events.target) {
    if (events.target.shapeName === 'point') {
      canvas.hoverCursor = 'default';
    } else if (events.target.shapeName === 'tempPoint') {
      canvas.hoverCursor = 'move';
    } else if (!events.target.selectable) {
      canvas.hoverCursor = 'crosshair';
    }
  } else {
    canvas.hoverCursor = 'crosshair';
  }
  canvas.renderAll();
}

function switchActiveFunction(newFunc) {
  activeFunction = newFunc;
}

function mouseOverEvents(events) {
  activeFunction(events);
}

function setAddPointsEventsCanvas(canvasObj) {
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
  activeFunction = initialMouseOverEventsPlaceHolderFunction;
}

function prepareToAddPolygonPoints(event) {
  removePolygonPoints();
  removeEditedPolygonId();
  setEditablePolygon(canvas, event.target, false, false, true);
  selectedPolygonId = event.target.id;
}

function drawLine(event) {
  if (addingPoints) {
    const pointer = canvas.getPointer(event.e);
    activeLine.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
  }
}

function createNewLine(...coordinates) {
  activeLine = new fabric.Line(coordinates, polygonProperties.newLine);
  canvas.add(activeLine);
  canvas.renderAll();
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
        const pointer = canvas.getPointer(event.e);
        createNewLine(event.target.left, event.target.top, pointer.x, pointer.y);
      } else {
        if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
          newPolygonSelected = true;
        } else {
          newPolygonSelected = false;
        }
        preventActiveObjectsAppearInFront(canvas);
      }
    }
  } else if (initialMode) {
    if (!event.target || (event.target && (event.target.shapeName !== 'point' && event.target.shapeName !== 'initialAddPoint'))) {
      changePolygonPointsToAddImpl(canvas);
      initialMode = false;
      switchActiveFunction(addingNewPointsFunction);
      const pointer = canvas.getPointer(event.e);
      lineArray.push(activeLine);
      createNewLine(pointer.x, pointer.y, pointer.x, pointer.y);
      const point = new fabric.Circle(polygonProperties.newPoint(tempPointIndex, pointer));
      canvas.add(point);
      tempPointIndex += 1;
    }
  } else if (event.target && event.target.shapeName === 'point') {
    addingPoints = false;
  } else if (!event.target
      || (event.target && (event.target.shapeName !== 'initialAddPoint' && event.target.shapeName !== 'tempPoint'))) {
    const pointer = canvas.getPointer(event.e);
    lineArray.push(activeLine);
    createNewLine(pointer.x, pointer.y, pointer.x, pointer.y);
    const point = new fabric.Circle(polygonProperties.newPoint(tempPointIndex, pointer));
    canvas.add(point);
    tempPointIndex += 1;
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
  mouseOverEvents,
};
