import fabric from 'fabric';
import { addLabelRef, setPolygonLabelOffsetProps } from '../label/label';
import labelProperties from '../label/properties';
import { addNewLabelToListFromPopUp, addExistingLabelToList } from '../../../tools/labelList/labelList';
import { addToLabelOptions, getLabelColor } from '../../../tools/labelList/labelOptions';
import { getLabelsVisibilityState, getMovableObjectsState, getContinuousDrawingState } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { addShape, addExistingShape } from './allShapes';

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

function generateLabel(label) {
  label.visible = getLabelsVisibilityState();
  canvas.add(label);
  canvas.bringToFront(label);
}

function generateLabelShapeGroup(shape, text) {
  shape.set('id', currentId);
  shape.set('shapeLabelText', text);
  const initialLocation = findInitialLabelLocation(shape);
  const textShape = new fabric.Text(text,
    labelProperties.getLabelProps(initialLocation, shape.shapeName));
  generateLabel(textShape);
  addToLabelOptions(textShape.text);
  const shapeColor = getLabelColor(textShape.text);
  addShape(shape, shapeColor, currentId);
  addLabelRef(textShape, currentId);
  addNewLabelToListFromPopUp(textShape.text, currentId, shapeColor.label);
  currentId += 1;
}

function resetPolygonSelectableArea(currentPolygon) {
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
}

function resizeAllObjects(object, newFileSizeRatio) {
  switch (object.shapeName) {
    case 'polygon':
      object.points.forEach((point) => {
        point.x *= newFileSizeRatio;
        point.y *= newFileSizeRatio;
      });
      resetPolygonSelectableArea(object);
      setPolygonLabelOffsetProps(object, object.points[0]);
      break;
    case 'tempPolygon':
      object.points.forEach((point) => {
        point.x *= newFileSizeRatio;
        point.y *= newFileSizeRatio;
      });
      break;
    case 'point':
    case 'invisiblePoint':
    case 'firstPoint':
    case 'tempPoint':
    case 'initialAddPoint':
    case 'label':
      object.top *= newFileSizeRatio;
      object.left *= newFileSizeRatio;
      break;
    case 'addPointsLine':
      object.top *= newFileSizeRatio;
      object.left *= newFileSizeRatio;
      object.height *= newFileSizeRatio;
      object.width *= newFileSizeRatio;
      object.x1 *= newFileSizeRatio;
      object.x2 *= newFileSizeRatio;
      object.y1 *= newFileSizeRatio;
      object.y2 *= newFileSizeRatio;
      break;
    case 'bndBox':
      object.height *= newFileSizeRatio;
      object.width *= newFileSizeRatio;
      object.top *= newFileSizeRatio;
      object.left *= newFileSizeRatio;
      break;
    default:
      break;
  }
  object.setCoords();
}

// a change will need to be made here
function repopulateLabelShapeGroup(shapeObj, label, id, newFileSizeRatio) {
  const shape = shapeObj.shapeRef;
  resizeAllObjects(shape, newFileSizeRatio);
  canvas.add(shapeObj.shapeRef);
  resizeAllObjects(label, newFileSizeRatio);
  generateLabel(label);
  addExistingShape(shapeObj, id);
  addLabelRef(label, id);
  const shapeColor = getLabelColor(shapeObj.shapeRef.shapeLabelText);
  addExistingLabelToList(shapeObj.shapeRef.shapeLabelText, id,
    shapeColor.label, shapeObj.visibility);
}

function calculateNewFileSizeRatio(previousDimensions) {
  return canvas.height / previousDimensions.originalHeight;
}

function repopulateLabelAndShapeObjects(existingShapes, existingLabels, previousDimensions) {
  if (previousDimensions.originalHeight) {
    const newFileSizeRatio = calculateNewFileSizeRatio(previousDimensions) / previousDimensions.oldImageHeightRatio;
    Object.keys(existingShapes).forEach((key) => {
      repopulateLabelShapeGroup(existingShapes[key], existingLabels[key], key, newFileSizeRatio);
    });
    canvas.renderAll();
  }
}

function setShapeMovablePropertiesOnImageSelect(existingShapes) {
  if (!getContinuousDrawingState()) {
    if (getMovableObjectsState()) {
      Object.keys(existingShapes).forEach((key) => {
        const shape = existingShapes[key].shapeRef;
        shape.lockMovementX = false;
        shape.lockMovementY = false;
        shape.hoverCursor = 'move';
      });
    } else {
      Object.keys(existingShapes).forEach((key) => {
        const shape = existingShapes[key].shapeRef;
        shape.lockMovementX = true;
        shape.lockMovementY = true;
        shape.hoverCursor = 'default';
      });
    }
  }
}

function assignCanvasForLabelAndShapeBuilder(canvasObj) {
  canvas = canvasObj;
}

export {
  assignCanvasForLabelAndShapeBuilder, repopulateLabelAndShapeObjects,
  findInitialLabelLocation, generateLabelShapeGroup, setShapeMovablePropertiesOnImageSelect,
};
