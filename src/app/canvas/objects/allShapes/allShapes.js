import { incrementShapeType, decrementShapeType } from '../../../tools/globalStatistics/globalStatistics';

let shapes = {};
let canvas = null;

function initializeShapes() {
  shapes = {};
}

function validateShapeObj(shapeObj) {
  if (!(shapeObj instanceof fabric.Object)) {
    throw new Error('shapeObj must be an instance of Fabric Object');
  }
}

function validateShapeColor(shapeColor) {
  if (typeof shapeColor !== 'object' || !shapeColor.hasOwnProperty('default') || !shapeColor.hasOwnProperty('stroke') || !shapeColor.hasOwnProperty('highlight')) {
    throw new Error('shapeColor must be an object with default, stroke, and highlight properties');
  }
}

function validateId(id) {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('id must be a non-empty string');
  }
}

function validateCanvas(canvasObj) {
  if (!(canvasObj instanceof fabric.Canvas)) {
    throw new Error('canvasObj must be an instance of Fabric Canvas');
  }
}

function validateShapeType(shapeType) {
  if (typeof shapeType !== 'string' || !['rect', 'circle', 'triangle'].includes(shapeType)) {
    throw new Error('shapeType must be one of "rect", "circle", or "triangle"');
  }
}

function incrementShapeTypeIfNotExist(shapeType) {
  if (!incrementShapeType(shapeType)) {
    shapes[shapeType] = 0;
    incrementShapeType(shapeType);
  }
}

function decrementShapeTypeIfExist(shapeType) {
  if (decrementShapeType(shapeType)) {
    delete shapes[shapeType];
  }
}

function createNewShapeObject(shapeObj, shapeColor) {
  validateShapeObj(shapeObj);
  validateShapeColor(shapeColor);

  const newShapeObject = { shapeRef: shapeObj, color: shapeColor, visibility: true };
  newShapeObject.shapeRef.set('fill', shapeColor.default);
  newShapeObject.shapeRef.set('stroke', shapeColor.stroke);
  return newShapeObject;
}

function addShape(shapeObj, shapeColor, id) {
  initializeShapes();
  validateShapeObj(shapeObj);
  validateShapeColor(shapeColor);
  validateId(id);

  const newShapeObject = createNewShapeObject(shapeObj, shapeColor);
  shapes[id] = newShapeObject;
  incrementShapeTypeIfNotExist(shapeObj.type);
}

function addShapeForInvisibleImage(shapeObj, shapeColor) {
  initializeShapes();
  validateShapeObj(shapeObj);
  validateShapeColor(shapeColor);

  const newShapeObject = createNewShapeObject(shapeObj, shapeColor);
  incrementShapeTypeIfNotExist(shapeObj.type);
  return newShapeObject;
}

function addExistingShape(shapeObj, id) {
  initializeShapes();
  validateShapeObj(shapeObj);
  validateId(id);

  shapes[id] = shapeObj;
}

function getShapeById(id) {
  initializeShapes();
  validateId(id);

  return shapes[id].shapeRef;
}

function getNumberOfShapes() {
  initializeShapes();

  return Object.keys(shapes).length;
}

function getAllExistingShapes() {
  initializeShapes();

  return shapes;
}

function removeAllShapeRefs() {
  initializeShapes();

  shapes = {};
}

function retrieveAllShapeRefs() {
  initializeShapes();
  const shapeRefs = {};

  Object.keys(shapes).forEach((key) => {
    shapeRefs[key] = shapes[key];
    if (canvas) {
      canvas.remove(shapes[key].shapeRef);
    }
  });
  shapes = {};
  return shapeRefs;
}

function getShapeColorById(id) {
  initializeShapes();
  validateId(id);

  return shapes[id].color;
}

function changeShapeVisibilityById(id) {
  initializeShapes();
  validateId(id);

  shapes[id].shapeRef.visible = !shapes[id].shapeRef.visible;
  shapes[id].visibility = !shapes[id].visibility;
  return shapes[id].visibility;
}

function getShapeVisibilityById(id) {
  initializeShapes();
  validateId(id);

  return shapes[id].shapeRef.visible;
}

function changeShapeColorById(id, color) {
  initializeShapes();
  validateId(id);
  validateShapeColor(color);

  shapes[id].color = color;
  shapes[id].shapeRef.set('fill', color.default);
  shapes[id].shapeRef.set('stroke', color.stroke);
  if (canvas) {
    canvas.renderAll();
  }
}

function highlightShapeFill(id) {
  initializeShapes();
  validateId(id);

  const highlightColor = shapes[id].color.highlight;
  shapes[id].shapeRef.set('fill', highlightColor);
  if (canvas) {
    canvas.renderAll();
  }
}

function defaultShapeFill(id) {
  initializeShapes();
  validateId(id);

  const defaultColor = shapes[id].color.default;
  shapes[id].shapeRef.set('fill', defaultColor);
  if (canvas) {
    canvas.renderAll();
  }
}

function removeFillForAllShapes() {
  initializeShapes();

  Object.keys(shapes).forEach((key) => {
    const defaultColor = shapes[key].color.default;
    shapes[key].shapeRef.set('fill', defaultColor);
  });
  if (canvas) {
    canvas.renderAll();
  }
}

function changeShapeLabelText(id, newText) {
  initializeShapes();
  validateId(id);

  shapes[id].shapeRef.set('shapeLabelText', newText);
}

function removeShape(id) {
  initializeShapes();
  validateId(id);

  decrementShapeTypeIfExist(shapes[id].shapeRef.type);
  if (canvas) {
    canvas.remove(shapes[id].shapeRef);
  }
  delete shapes[id];
}

function assignCanvasForShapeFillManipulation(canvasObj) {
  initializeShapes();
  validateCanvas(canvasObj);

  canvas = canvasObj;
}

export {
  changeShapeVisibilityById, getNumberOfShapes, getAllExistingShapes,
  removeShape, highlightShapeFill, defaultShapeFill, retrieveAllShapeRefs,
  removeFillForAllShapes, getShapeVisibilityById, addShapeForInvisibleImage,
  getShapeById, getShapeColorById, changeShapeColorById, changeShapeLabelText,
  addShape, addExistingShape, removeAllShapeRefs, assignCanvasForShapeFillManipulation,
};
