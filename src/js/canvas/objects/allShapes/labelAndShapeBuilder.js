import fabric from 'fabric';
import { addLabelRef, setPolygonLabelOffsetProps } from '../label/label';
import labelProperties from '../label/properties';
import { addNewLabelToListFromPopUp, addExistingLabelToList } from '../../../tools/labelList/labelList';
import { addToLabelOptions, getLabelColor } from '../../../tools/labelList/labelOptions';
import { addShape, addExistingShape } from '../allShapes/allShapes';

let currentId = 0;
let canvas = null;

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

function generateLabelShapeGroup(shape, text) {
  shape.set('id', currentId);
  shape.set('shapeLabelText', text);
  const initialLocation = findInitialLabelLocation(shape);
  const textShape = new fabric.Text(text,
    labelProperties.getLabelProps(initialLocation, shape.shapeName));
  canvas.add(textShape);
  canvas.bringToFront(textShape);
  addToLabelOptions(textShape.text);
  const shapeColor = getLabelColor(textShape.text);
  addShape(shape, shapeColor, currentId);
  addLabelRef(textShape, currentId);
  addNewLabelToListFromPopUp(textShape.text, currentId, shapeColor.label);
  currentId += 1;
}

function repopulateLabelShapeGroup(shape) {
  canvas.add(shape);
  const initialLocation = findInitialLabelLocation(shape);
  const textShape = new fabric.Text(shape.shapeLabelText,
    labelProperties.getLabelProps(initialLocation, shape.shapeName));
  canvas.add(textShape);
  canvas.bringToFront(textShape);
  const shapeColor = getLabelColor(textShape.text);
  addLabelRef(textShape, shape.id);
  addExistingLabelToList(shape.shapeLabelText, shape.id, shapeColor.label);
}

function repopulateLabelAndShapeObjects(existingShapes) {
    Object.keys(existingShapes).forEach((key) => {
      repopulateLabelShapeGroup(existingShapes[key].shapeRef);
      addExistingShape(existingShapes[key], key);
    });
    canvas.renderAll();
  }

  function assignCanvasForLabelAndShapeBuilder(canvasObj) {
    canvas = canvasObj;
}

export { 
    assignCanvasForLabelAndShapeBuilder, repopulateLabelAndShapeObjects,
    findInitialLabelLocation, generateLabelShapeGroup,
};