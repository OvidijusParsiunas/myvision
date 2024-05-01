import fabric from 'fabric';
import { setPolygonLabelOffsetProps } from '../../label/label';
import { removeShape, addShape, getShapeColorById } from '../../allShapes/allShapes';

// Initialize variables for storing the current polygon, its points, the canvas, and its properties
let currentPolygon = null;
let polygonPoints = [];
let canvas = null;
let polygonProperties = null;
let movePolygonPointOffsetReduction = 0;

// Function to set the objects for the current polygon, points array, canvas, and properties object
function setObjets(polygonObj, polygonPointsArray, canvasObj, polygonPropertiesObj) {
  currentPolygon = polygonObj;
  polygonPoints = polygonPointsArray;
  canvas = canvasObj;
  polygonProperties = polygonPropertiesObj;
}

// Function to generate a new polygon with the given properties
function generateNewPolygon() {
  const newPolygon = new fabric.Polygon([], polygonProperties.newPolygon());
  newPolygon.set({
    id: currentPolygon.id,
    selectable: true,
    hoverCursor: 'move',
    shapeLabelText: currentPolygon.shapeLabelText,
  });
  return newPolygon;
}

// Function to calculate the new points coordinates after moving the polygon
function calculateMovedPointsCoordinates() {
  const matrix = currentPolygon.calcTransformMatrix();
  const movedPoints = currentPolygon.get('points')
    .map((p) => new fabric.Point(
      p.x - currentPolygon.pathOffset.x,
      p.y - currentPolygon.pathOffset.y,
    ))
    .map((p) => fabric.util.transformPoint(p, matrix));
  return movedPoints;
}

// Function to generate new points based on the moved points coordinates
function generateNewPoints(movedPoints) {
  let pointId = 0;
  const movedPointsCoordinates = [];
  movedPoints.forEach((p) => {
    const point = new fabric.Circle(polygonProperties.existingPolygonPoint(pointId, p, true));
    point.set('polygonMoved', true);
    canvas.add(point);
    polygonPoints.push(point);
    movedPointsCoordinates.push({ x: point.left - 1, y: point.top - 1 });
    pointId += 1;
  });
  return movedPointsCoordinates;
}

// Function to move the polygon to its new position
function movePolygonToNewPosition() {
  const newPosition = currentPolygon._calcDimensions();
  currentPolygon.set({
    left: newPosition.left,
    top: newPosition.top,
    height: newPosition.height,
    width: newPosition.width,
    pathOffset: {
      x: newPosition.left + newPosition.width / 2 - movePolygonPointOffsetReduction,
      y: newPosition.top + newPosition.height / 2 - movePolygonPointOffsetReduction,
    },
  });
  currentPolygon.setCoords();
  canvas.renderAll();
}

// Function to generate the polygon after moving it and updating the points array
function generatePolygonAfterMove(polygonObj, polygonPointsArray, canvasObj, polygonPropertiesObj) {
  setObjets(polygonObj, polygonPointsArray, canvasObj, polygonPropertiesObj);
  const newPolygon = generateNewPolygon();
  canvas.add(newPolygon);
  const movedPoints = calculateMovedPointsCoordinates();
  const polygonPointsCoordinates = generateNewPoints(movedPoints);
  const currentPolygonColor = getShapeColorById(currentPolygon.id);
  removeShape(currentPolygon.id);
  addShape(newPolygon, currentPolygonColor, newPolygon.id);
  currentPolygon = newPolygon;
  currentPolygon.set('polygonMoved', true);
  currentPolygon.set('points', polygonPointsCoordinates);
  movePolygonToNewPosition(currentPolygon, canvas);
  setPolygonLabelOffsetProps(currentPolygon, currentPolygon.points[0]);
  return currentPolygon;
}

// Function to change the move polygon path offset reduction value
function changeMovePolygonPathOffset(newOffsetReduction) {
  movePolygonPointOffsetReduction = newOffsetReduction;
}

// Export the generatePolygonAfterMove and changeMovePolygonPathOffset functions for use in other modules
export { generatePolygonAfterMove, changeMovePolygonPathOffset };

