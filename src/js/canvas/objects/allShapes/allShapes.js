const shapeObjects = {};
let canvas = null;

function addShapeRef(shapeObj, id) {
  shapeObjects[id] = shapeObj;
}

function getShapeById(id) {
  return shapeObjects[id];
}

function highlightShapeFill(id) {
  shapeObjects[id].set('fill', 'rgba(255,0,0,0.2)');
  canvas.renderAll();
}

function defaultShapeFill(id) {
  shapeObjects[id].set('fill', 'rgba(255,0,0,0.01)');
  canvas.renderAll();
}

function removeShape(id) {
  canvas.remove(shapeObjects[id]);
  delete shapeObjects[id];
}

function assignCanvasForShapeFillManipulation(canvasObj) {
  canvas = canvasObj;
}

export {
  addShapeRef, getShapeById, highlightShapeFill, removeShape,
  defaultShapeFill, assignCanvasForShapeFillManipulation,
};
