import fabric from 'fabric';
import setAddPointsMode from '../../cursorModes/addPointsMode';
import { removeEditedPolygonId } from './editPolygonEventsWorker';
import {
  removePolygonPoints, getPolygonEditingStatus, setEditablePolygon, getPolygonIdIfEditing,
  getPolygonIfEditing,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import polygonProperties from '../../../objects/polygon/properties';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { changePolygonPointsToAddImpl } from '../../../objects/polygon/alterPolygon/changePointsStyle';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let addingPoints = false;
let activeLine = null;
let lineArray = [];
let initialMode = false;
let tempPointIndex = 0;
let activeFunction = null;
let initialPoint = null;
let pointsArray = [];
let coordinatesOfLastMouseHover = null;

function isRightMouseButtonClicked(pointer) {
  if (coordinatesOfLastMouseHover.x !== pointer.x) {
    return true;
  }
  return false;
}
/* make sure to reuse this all */

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
  // should not be managed here
}

function moveAddPoints(event) {
  if (addingPoints) {
    const xCenterPoint = event.target.getCenterPoint().x;
    const yCenterPoint = event.target.getCenterPoint().y;
    const { pointId } = event.target;
    lineArray[pointId].set({ x2: xCenterPoint, y2: yCenterPoint });
    if ((pointId + 1) !== tempPointIndex) {
      lineArray[pointId + 1].set({ x1: xCenterPoint, y1: yCenterPoint });
    } else {
      activeLine.set({ x1: xCenterPoint, y1: yCenterPoint });
    }
  }
}

function drawLine(event) {
  if (addingPoints) {
    const pointer = canvas.getPointer(event.e);
    coordinatesOfLastMouseHover = pointer;
    activeLine.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
  }
}

function createNewLine(...coordinates) {
  activeLine = new fabric.Line(coordinates, polygonProperties.newLine);
  canvas.add(activeLine);
  canvas.renderAll();
}

function clearAddPointsData() {
  pointsArray.forEach((point) => {
    canvas.remove(point);
  });
  pointsArray = [];
  lineArray.forEach((line) => {
    canvas.remove(line);
  });
  lineArray = [];
  canvas.remove(activeLine);
  activeLine = null;
}

function addNewPointsToExistingPoints(polygon, originalPointsArray, finalPoint) {
  // dereference
  const derefPointsArray = originalPointsArray.slice();
  let initialId = initialPoint.pointId;
  const finalId = finalPoint.pointId;
  let rightPoint = null;
  if ((initialId - 1) < 0) {
    rightPoint = derefPointsArray[derefPointsArray.length - 1];
  } else {
    rightPoint = derefPointsArray[initialId - 1];
  }
  const leftPoint = derefPointsArray[initialId + 1];
  const originalPoint = derefPointsArray[initialId];

  const firstPoint = pointsArray[0];
  const firstHypotenuse = Math.hypot(originalPoint.x - firstPoint.left, originalPoint.y - firstPoint.top);
  const secondHypotenuse = Math.hypot(rightPoint.x - originalPoint.x, rightPoint.y - originalPoint.y);
  const thirdHypotenuse = Math.hypot(rightPoint.x - firstPoint.left, rightPoint.y - firstPoint.top);
  let origanlPointAngle = ((firstHypotenuse * firstHypotenuse) + (secondHypotenuse * secondHypotenuse) - (thirdHypotenuse * thirdHypotenuse)) / (2 * firstHypotenuse * secondHypotenuse);
  console.log(origanlPointAngle);
  console.log(Math.acos(origanlPointAngle) * 180/ Math.PI);
  origanlPointAngle = Math.acos(origanlPointAngle) * 180/ Math.PI;

  const firstHypotenuse2 = Math.hypot(originalPoint.x - firstPoint.left, originalPoint.y - firstPoint.top);
  const secondHypotenuse2 = Math.hypot(leftPoint.x - originalPoint.x, leftPoint.y - originalPoint.y);
  const thirdHypotenuse2 = Math.hypot(leftPoint.x - firstPoint.left, leftPoint.y - firstPoint.top);
  let origanlPointAngle2 = ((firstHypotenuse2 * firstHypotenuse2) + (secondHypotenuse2 * secondHypotenuse2) - (thirdHypotenuse2 * thirdHypotenuse2)) / (2 * firstHypotenuse2 * secondHypotenuse2);
  console.log(origanlPointAngle2);
  console.log(Math.acos(origanlPointAngle2) * 180/ Math.PI);
  origanlPointAngle2 = Math.acos(origanlPointAngle2) * 180/ Math.PI;
  if (origanlPointAngle > origanlPointAngle2) {
    const difference = Math.abs(initialId - finalId);
    initialId += 1;
    let newPointsArray = [];
    if (finalId < initialId) {
      newPointsArray = derefPointsArray.slice(finalId, initialId);
    } else {
      newPointsArray = derefPointsArray.slice(0, initialId);
    }
    pointsArray.forEach((point) => {
      newPointsArray.push({ x: point.left, y: point.top });
    });
    initialId = initialId + difference - 1;
    for (let i = initialId; i < derefPointsArray.length; i += 1) {
      newPointsArray.push(derefPointsArray[i]);
    }
    polygon.set({ points: newPointsArray });
  } else if (origanlPointAngle < origanlPointAngle2) {
    const difference = Math.abs(initialId - finalId);
    let newPointsArray = [];
    initialId += 1;
    newPointsArray = derefPointsArray.slice(0, finalId + 1);
    for (let i = pointsArray.length - 1; i > 0; i -= 1) {
      const point = pointsArray[i];
      newPointsArray.push({ x: point.left, y: point.top });
    }
    initialId = initialId + difference - 1;
    for (let i = derefPointsArray.length - 1; i > initialId; i -= 1) {
      newPointsArray.push(derefPointsArray[i]);
    }
    polygon.set({ points: newPointsArray });
  }


  // regenerate polygon array points
  clearAddPointsData();
}

function completePolygon(finalPoint) {
  const polygon = getPolygonIfEditing();
  addNewPointsToExistingPoints(polygon, polygon.points, finalPoint);
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
        initialPoint = event.target;
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
      pointsArray.push(point);
      tempPointIndex += 1;
      canvas.bringToFront(initialPoint);
    }
  } else if (event.target && event.target.shapeName === 'point') {
    addingPoints = false;
    completePolygon(event.target);
  } else if (!event.target
      || (event.target && (event.target.shapeName !== 'initialAddPoint' && event.target.shapeName !== 'tempPoint'))) {
    const pointer = canvas.getPointer(event.e);
    if (!isRightMouseButtonClicked(pointer)) {
      lineArray.push(activeLine);
      createNewLine(pointer.x, pointer.y, pointer.x, pointer.y);
      const point = new fabric.Circle(polygonProperties.newPoint(tempPointIndex, pointer));
      canvas.add(point);
      pointsArray.push(point);
      tempPointIndex += 1;
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
  mouseOverEvents,
  moveAddPoints,
};
