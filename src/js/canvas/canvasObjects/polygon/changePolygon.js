let currentlySelectedPolygonObjects;
let canvas;

function displayPolygonPoints(canvasObj, polygonObjects) {
  canvas = canvasObj;
  currentlySelectedPolygonObjects = polygonObjects;
  for (let i = 2; i < polygonObjects.length; i += 1) {
    polygonObjects[i].set('visible', true);
  }
  canvasObj.renderAll();
}

function hidePolygonPoints() {
  if (currentlySelectedPolygonObjects) {
    for (let i = 2; i < currentlySelectedPolygonObjects.length; i += 1) {
      currentlySelectedPolygonObjects[i].set('visible', false);
    }
    canvas.renderAll();
  }
}

export { displayPolygonPoints, hidePolygonPoints };
