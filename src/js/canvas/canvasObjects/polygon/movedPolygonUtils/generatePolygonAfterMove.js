import fabric from 'fabric';

let currentPolygon = null;
let polygonPoints = [];
let canvas = null;
let polygonProperties = null;

function setObjets(polygonObj, polygonPointsArray, canvasObj, polygonPropertiesObj) {
  currentPolygon = polygonObj;
  polygonPoints = polygonPointsArray;
  canvas = canvasObj;
  polygonProperties = polygonPropertiesObj;
}

function generateNewPolygon() {
  const newPolygon = new fabric.Polygon([], polygonProperties.newPolygon);
  newPolygon.set({ id: currentPolygon.id, selectable: true });
  return newPolygon;
}

function calculateMovedPointsCoordinates() {
  const matrix = currentPolygon.calcTransformMatrix();
  const movedPoints = currentPolygon.get('points')
    .map(p => new fabric.Point(
      p.x - currentPolygon.pathOffset.x,
      p.y - currentPolygon.pathOffset.y,
    ))
    .map(p => fabric.util.transformPoint(p, matrix));
  return movedPoints;
}

function generateNewCircles(movedPoints) {
  let pointId = 0;
  const movedPointsCoordinates = [];
  movedPoints.forEach((p) => {
    const point = new fabric.Circle(polygonProperties.existingPolygonCircle(pointId, p));
    canvas.add(point);
    polygonPoints.push(point);
    movedPointsCoordinates.push({ x: point.left - 1, y: point.top - 1 });
    pointId += 1;
  });
  return movedPointsCoordinates;
}

function movePolygonToNewPosition() {
  const newPosition = currentPolygon._calcDimensions();
  currentPolygon.set({
    left: newPosition.left,
    top: newPosition.top,
    height: newPosition.height,
    width: newPosition.width,
    pathOffset: {
      x: newPosition.left + newPosition.width / 2,
      y: newPosition.top + newPosition.height / 2,
    },
  });
  currentPolygon.setCoords();
  canvas.renderAll();
}

function generatePolygonAfterMove(polygonObj, polygonPointsArray, canvasObj, polygonPropertiesObj) {
  setObjets(polygonObj, polygonPointsArray, canvasObj, polygonPropertiesObj);
  const newPolygon = generateNewPolygon();
  canvas.add(newPolygon);
  const movedPoints = calculateMovedPointsCoordinates();
  const polygonPointsCoordinates = generateNewCircles(movedPoints);
  canvas.remove(currentPolygon);
  currentPolygon = newPolygon;
  currentPolygon.set('points', polygonPointsCoordinates);
  movePolygonToNewPosition(currentPolygon, canvas);
  return currentPolygon;
}

export { generatePolygonAfterMove as default };
