import fabric from 'fabric';
import setAddPointsMode from '../../cursorModes/addPointsMode';
import { removeEditedPolygonId } from './editPolygonEventsWorker';
import {
  removePolygonPoints, getPolygonEditingStatus, setEditablePolygon,
  getPolygonIdIfEditing, getPolygonIfEditing, resetPolygonSelectableArea,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import polygonProperties from '../../../objects/polygon/properties';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { changePolygonPointsToAddImpl } from '../../../objects/polygon/alterPolygon/changePointsStyle';
import { resetCanvasEventsToDefault } from '../resetCanvasUtils/resetCanvasEventsFacade';

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

// error on clicking remove then new polygon
// when clicking on rectangle, doesn't stay on top of other polygons

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

function removeEditingPolygonPoints() {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName === 'point') {
      canvas.remove(iteratedObj);
    } else if (iteratedObj.shapeName === 'initialAddPoint') {
      canvas.remove(iteratedObj);
    }
  });
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
  removeEditingPolygonPoints();
  resetPolygonSelectableArea();
  resetCanvasEventsToDefault();
}

function calculateTotalLineDistance(pointsArr) {
  let totalDistance = 0;
  for (let i = 0; i < pointsArr.length - 1; i += 1) {
    const distance = Math.hypot(pointsArr[i + 1].x - pointsArr[i].x,
      pointsArr[i + 1].y - pointsArr[i].y);
    totalDistance += distance;
  }
  return totalDistance;
}

function addNewPointsToExistingPoints(polygon, originalPointsArray, finalPoint) {
  // dereference
  const derefPointsArray = originalPointsArray.slice();
  let initialId = initialPoint.pointId;
  const finalId = finalPoint.pointId;
  const totalDistance = calculateTotalLineDistance(derefPointsArray);
  console.log(totalDistance);
  let rightPoint = null;
  if ((initialId - 1) < 0) {
    rightPoint = derefPointsArray[derefPointsArray.length - 1];
  } else {
    rightPoint = derefPointsArray[initialId - 1];
  }
  const leftPoint = derefPointsArray[initialId + 1];
  const originalPoint = derefPointsArray[initialId];

  const firstPoint = pointsArray[0];
  const difference = Math.abs(initialId - finalId);
  let newPointsArray = [];
  if (finalId < initialId) {
    let oppositeArray = [];
    for (let i = initialId; i > finalId - 1; i -= 1) {
      oppositeArray.push(derefPointsArray[i]);
    }
    const oppositeArrayDistance = calculateTotalLineDistance(oppositeArray);

    let forwardArray = [];
    for (let i = initialId; i < derefPointsArray.length; i += 1) {
      forwardArray.push(derefPointsArray[i]);
    }
    for (let i = 0; i < finalId + 1; i += 1) {
      forwardArray.push(derefPointsArray[i]);
    }
    const forwardArrayDistance = calculateTotalLineDistance(forwardArray);

    if (forwardArrayDistance < oppositeArrayDistance) {
      initialId += 1;
      newPointsArray = derefPointsArray.slice(finalId, initialId);
      pointsArray.forEach((point) => {
        newPointsArray.push({ x: point.left, y: point.top });
      });
    } else {
      newPointsArray = derefPointsArray.slice(0, finalId + 1);
      for (let i = pointsArray.length - 1; i > -1; i -= 1) {
        const point = pointsArray[i];
        newPointsArray.push({ x: point.left, y: point.top });
      }
      for (let i = initialId; i < derefPointsArray.length; i += 1) {
        newPointsArray.push(derefPointsArray[i]);
      }
    }
  } else {
    let oppositeArray = [];
    for (let i = finalId; i < derefPointsArray.length; i += 1) {
      oppositeArray.push(derefPointsArray[i]);
    }
    for (let i = 0; i < initialId + 1; i += 1) {
      oppositeArray.push(derefPointsArray[i]);
    }

    const oppositeArrayDistance = calculateTotalLineDistance(oppositeArray);

    let forwardArray = [];
    for (let i = initialId; i < finalId + 1; i += 1) {
      forwardArray.push(derefPointsArray[i]);
    }

    const forwardArrayDistance = calculateTotalLineDistance(forwardArray);

    if (forwardArrayDistance < oppositeArrayDistance) {
      initialId += 1;
      newPointsArray = derefPointsArray.slice(0, initialId);
      pointsArray.forEach((point) => {
        newPointsArray.push({ x: point.left, y: point.top });
      });
      for (let i = finalId; i < derefPointsArray.length; i += 1) {
        newPointsArray.push(derefPointsArray[i]);
      }
    } else {
      newPointsArray = derefPointsArray.slice(initialId, finalId + 1);
      for (let i = pointsArray.length - 1; i > -1; i -= 1) {
        newPointsArray.push({ x: pointsArray[i].left, y: pointsArray[i].top });
      }
    }
  }

  polygon.set({ points: newPointsArray });
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
