const shapes = {};
let canvas = null;

function addShapeRef(shapeObj, shapeColor, id) {
  shapes[id] = { shapeRef: shapeObj, color: shapeColor };
}

function getShapeById(id) {
  return shapes[id].shapeRef;
}

function getShapeColorById(id) {
  return shapes[id].color;
}

function changeShapeColorById(id, color) {
  shapes[id].color = color;
  shapes[id].shapeRef.set('fill', color.default);
  canvas.renderAll();
}

function highlightShapeFill(id) {
  const highlightColor = shapes[id].color.highlight;
  shapes[id].shapeRef.set('fill', highlightColor);
  canvas.renderAll();
}

function defaultShapeFill(id) {
  const defaultColor = shapes[id].color.default;
  shapes[id].shapeRef.set('fill', defaultColor);
  canvas.renderAll();
}

function removeShape(id) {
  canvas.remove(shapes[id].shapeRef);
  delete shapes[id];
}

function assignCanvasForShapeFillManipulation(canvasObj) {
  canvas = canvasObj;
}

export {
  addShapeRef, getShapeById, getShapeColorById, changeShapeColorById, removeShape,
  highlightShapeFill, defaultShapeFill, assignCanvasForShapeFillManipulation,
};
