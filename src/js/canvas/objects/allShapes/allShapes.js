import labelProperties from '../label/properties';
import { setPolygonLabelOffsetProps } from '../label/label';

let shapes = {};
let canvas = null;

function addShape(shapeObj, shapeColor, id) {
  shapes[id] = { shapeRef: shapeObj, color: shapeColor, visibility: true };
  shapes[id].shapeRef.set('fill', shapeColor.default);
  shapes[id].shapeRef.set('stroke', shapeColor.stroke);
}

function getShapeById(id) {
  return shapes[id].shapeRef;
}

function getAllShapes() {
  const shapeRefs = {};
  Object.keys(shapes).forEach((key) => {
    shapeRefs[key] = shapes[key];
    canvas.remove(shapes[key].shapeRef);
  });  
  canvas.forEachObject((iteratedObj) => {
    canvas.remove(iteratedObj);
  });
    // populate labels list (remove all entries or repopulate them)
  shapes = {};
  // two options - copy all objects references, remove from canvas - but keep the refs (also color option)
  // for each shape get reference and color which is all added to a new object
  return shapeRefs;
}

// consider how zooming will work
// different file
function findInitialLabelLocation(shape) {
  const locationObj = {};
  if (shape.shapeName === 'bndBox') {
    locationObj.left = shape.left + labelProperties.boundingBoxOffsetProperties().left;
    locationObj.top = shape.top;
  } else if (shape.shapeName === 'polygon') {
    const left = shape.points[0].x - labelProperties.pointOffsetProperties().left;
    const top = shape.points[0].y - labelProperties.pointOffsetProperties().top;
    locationObj.left = left;
    locationObj.top = top;
    setPolygonLabelOffsetProps(shape, shape.points[0]);
  }
  return locationObj;
}

function generateLabelShapeGroup(shape) {
  const initialLocation = findInitialLabelLocation(shape);
  const textShape = new fabric.Text(shape.shapeLabelText,
    labelProperties.getLabelProps(initialLocation, shape.shapeName));
  canvas.add(textShape);
  canvas.bringToFront(textShape);
  // addToLabelOptions(textShape.text);
  // const shapeColor = getLabelColor(textShape.text);
  // addShape(targetShape, shapeColor, currentId);
  // addLabelRef(textShape, currentId);
  // addNewLabelToListFromPopUp(textShape.text, currentId, shapeColor.label);
  /// currentId += 1;
}

function addAllShapes(imageShapes) {
  Object.keys(imageShapes).forEach((key) => {
    canvas.add(imageShapes[key].shapeRef);
    generateLabelShapeGroup(imageShapes[key].shapeRef);
    console.log(imageShapes[key]);
    shapes[key] = imageShapes[key];
  });
  canvas.renderAll();
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
  getShapeVisibilityById, getAllShapes, addAllShapes,
};
