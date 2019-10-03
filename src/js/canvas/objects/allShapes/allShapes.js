let shapes = {};
let canvas = null;

function addShape(shapeObj, shapeColor, id) {
  shapes[id] = { shapeRef: shapeObj, color: shapeColor, visibility: true };
  shapes[id].shapeRef.set('fill', shapeColor.default);
  shapes[id].shapeRef.set('stroke', shapeColor.stroke);
}

function addExistingShape(shapeObj, id) {
  shapes[id] = shapeObj;
}

function getShapeById(id) {
  return shapes[id].shapeRef;
}

function removeAndRetrieveAllShapeRefs() {
  const shapeRefs = {};
  Object.keys(shapes).forEach((key) => {
    shapeRefs[key] = shapes[key];
    canvas.remove(shapes[key].shapeRef);
  });  
  shapes = {};
  return shapeRefs;
}

function getShapeColorById(id) {
  return shapes[id].color;
}

function changeShapeVisibilityById(id) {
  shapes[id].shapeRef.visible = !shapes[id].shapeRef.visible;
}

function getShapeVisibilityById(id) {
  return shapes[id].shapeRef.visible;
}

function changeShapeColorById(id, color) {
  shapes[id].color = color;
  shapes[id].shapeRef.set('fill', color.default);
  shapes[id].shapeRef.set('stroke', color.stroke);
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
  getShapeById, getShapeColorById, changeShapeColorById,
  addShape, removeShape, highlightShapeFill, defaultShapeFill,
  changeShapeVisibilityById, assignCanvasForShapeFillManipulation,
  getShapeVisibilityById, removeAndRetrieveAllShapeRefs, addExistingShape,
};
